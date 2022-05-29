class Client < ApplicationRecord
  include Searchable

  attr_searchable %w(first_name last_name email)

  belongs_to :account
  belongs_to :model_type
  has_many :clientships
  has_many :users, -> {order('clientships.updated_at').select('users.*, clientships.updated_at as clientship_updated_at').distinct}, through: :clientships, dependent: :destroy
  has_many :logs, dependent: :nullify
  # CPA stands for Client-Property-Association (many-to-many join table)
  has_many :cpas
  has_many :properties, -> { distinct }, through: :cpas
  has_one_attached :ordertoviewfile
  has_one_attached :ordertosellfile

  before_create { self.color = COLOR_PALETTE.sample } # This assigns a random bg color to each new user

  # This is for existing log records. A user may also be an action author (user object again) thus we need to handle
  # that as well.
  # https://stackoverflow.com/a/9326882/178728
  before_destroy do |record|
    Cpa.where(client_id: record).update_all(client_id: nil)
  end

  after_commit :handle_qrcode, on: [:create, :update]

  # This is for existing log records
  # https://stackoverflow.com/a/9326882/178728
  # before_destroy { |record| Log.where(client: record).update_all(client_name: record.full_name) }

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }

  # before_save happens after validation that's why we use before_validation
  before_validation do
    if account.present?
      self.model_type = account.model_types.find_by(name: 'clients')
    end
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def handle_qrcode
    @vcard = ::VCardigan.create(:version => '3.0')
    @vcard.fullname full_name

    if telephones.present?
      telephones_list = telephones.split(/[\s,']/).reject(&:empty?)
      @vcard.tel telephones_list.first, :type => 'work'
    end

    if email.present?
      @vcard.email email, :type => 'work'
    end

    qr = RQRCode::QRCode.new(@vcard.to_s, :level => :l)

    qrcode_svg = qr.as_svg(
      color: "000",
      shape_rendering: "crispEdges",
      module_size: 3,
      standalone: true,
      use_path: true
    )

    # We need to skip callbacks cause otherwise we'll face infinite loops
    update_column(:qrcode, qrcode_svg)
  end

  def searchprefs_available
    @searchprefs_available ||= searchprefs.present?
  end

  def visited(account)
    Property.joins(:cpas).where(cpas: { viewership: true, client: self, account: account }).pluck(:slug)
  end
end
