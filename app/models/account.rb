class Account < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  accepts_nested_attributes_for :owner
  validates :subdomain,
            presence: true,
            length: { minimum: 3, maximum: 20 },
            uniqueness: true,
            format: /\A[a-zA-Z0-9]*\z/

  validates :name, presence: true, length: { maximum: 20 }, uniqueness: true
  # This is intentionally commented out since accounts can't be created on signup without description.
  # We only do js validation on this on the edit screen
  # validates :description, presence: true

  has_many :invitations, dependent: :destroy # Only destroys invitations associated with the current account
  has_many :properties, dependent: :destroy # Only destroys properties associated with the current account
  has_many :clients, dependent: :destroy # Only destroys clients associated with the current account
  has_many :cpas, dependent: :destroy # Only destroys cpas associated with the current account
  # Favlists have 2 foreign keys: 1 to table Users and 1 to table Accounts. Deleting a User will drop all its
  # favlists in all of his accounts. Deleting an account will delete all the favlists belonging to current account
  # of all users.
  has_many :favlists, dependent: :destroy # Only destroys favlists associated with the current account

  has_many :memberships
  has_many :users, through: :memberships, dependent: :destroy
  has_many :logs, dependent: :nullify
  # Each account auto generates 3 model types one for each of users, properties & clients
  # Properties and clients are scoped to account and linked to each model through a regular foreign key.
  # However users may belong to multiple accounts and each account can have its own model fields. Thus for
  # users we use a HABTM association.
  has_many :model_types, dependent: :destroy

  has_many :notifications

  has_many :ilocations, dependent: :destroy

  has_one_attached :avatar

  validates_associated :owner

  before_create :confirmation_token
  after_create :build_custom_fields, :generate_sample_properties

  before_validation do
    self.subdomain = self.subdomain.downcase unless subdomain.blank?
  end

  enum flavor: { :greek => 0, :international => 1 }

  enum subscription_status: { :trial => 0, :active => 1, :cancelled => 2, :expired => 3 }

  # This is for existing log records
  # https://stackoverflow.com/a/9326882/178728
  # before_destroy { |record| Log.where(account: record).update_all(account_name: record.subdomain) }

  # Returns all account users including the owner of the account
  # Uses the active_record_union gem
  def all_users
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.union(User.where(id: owner.id))
  end

  def all_users_plus_sys
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.union(User.where(id: [owner.id, 1]))
  end

  class << self

    # Returns the registered subdomain
    def get_subdomain(user)
      # unless current_account.owner == current_user ||
      #     current_account.users.exists?(current_user.id)
      # This will only work if the user is also the account owner
      self.find_by(owner_id: user.id).subdomain
    end

    def subdomain_exists?(requested_subdomain)
      subdomain = self.find_by(subdomain: requested_subdomain)
      !!subdomain
    end

    def deactivate_trials
      where(subscription_status: :trial).where("created_at < ?", 14.days.ago).update(subscription_status: :expired)
    end

    def deactivate_stale_accounts
      where(subscription_status: :active).where.not(subdomain: %w[demo escalate akinitoexpert]).where("last_paid_at < ?", 40.days.ago).update(subscription_status: :expired)
    end
  end

  # self is explicitly used here to indicate the newly created object
  def build_custom_fields
    %w(users properties clients).each do |el|
      self.model_types.create(name: el.to_s)
    end
  end

  def generate_sample_properties
    if greek?
      sample_data_a = {
          title: 'Νεόδμητο διαμέρισμα στο Γαλάτσι',
          description: 'Διαμέρισμα 85τμ 1ου ορόφου, νεόδμητο, με εκπληκτική θέα θάλασσα, πολυτελούς κατασκευής με ακριβά υλικά, άριστα σχεδιασμένα σε minimal γραμμές. Διαθέτει 2υ/δ, ένα πλήρες μπάνιο, wc επισκεπτών, χώρο υποδοχής με τζάκι και κουζίνα open plan. Επιπλέον διαθέτει εξωτερική θερμοπρόσοψη, κουφώματα με θερμοδιακοπή και ενεργειακά κρύσταλλα, ενδοδαπέδια θέρμανση με ατομικό λέβητα φυσικού αερίου.',
          businesstype: :sell,
          category: Category.find(5),
          size: 85,
          price: 285000,
          bedrooms: 2,
          bathrooms: 1,
          floor: :"1",
          construction: 2021,
          account: self,
          address: 'Χαρ. Τρικούπη 49, Γαλάτσι 111 47',
          availability: DateTime.current.to_date,
          has_energy_cert: true,
          energy_cert: :a_plus,
          map_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.28739727787!2d23.754468567879663!3d38.01707889941776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1a25ac6a0ba1b%3A0x4c11a3d10b1b9f6!2sOfficemall.gr!5e0!3m2!1sen!2sgr!4v1651252591936!5m2!1sen!2sgr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
          notes: 'Τιμή διαπραγματεύσιμη αλλά δεν πέφτει κάτω από τα 250',
          location: Location.find(2122),
          model_type: self.model_types.find_by(name: 'properties'),
          sample: true
        }
      sample_data_b = {
        title: 'Επαγγελματικός χώρος στην Βούλα',
        description: 'Γραφείο 1ου ορόφου με κουζινάκι και 2 WC. Παρέχει κλιματισμό, έχει δομημένη καλωδίωση καθώς και φωτιστικά οροφής. Πρόκειται για εξαιρετική τοποθεσία σε ήσυχο μέρος με θέα δάσος.',
        businesstype: :sell,
        category: Category.find(14),
        size: 125,
        price: 400000,
        floor: :"1",
        bedrooms: 1,
        bathrooms: 1,
        construction: 2001,
        address: 'Δημητρακοπούλου 41',
        availability: DateTime.current.to_date,
        account: self,
        location: Location.find(2205),
        has_energy_cert: true,
        energy_cert: :b,
        map_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3150.5577598612763!2d23.769326114957284!3d37.84723781576076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a19566fd450c8b%3A0x905434363ef5e32d!2sDimitrakopoulou%2041%2C%20Voula%20166%2073!5e0!3m2!1sen!2sgr!4v1651252396189!5m2!1sen!2sgr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        notes: 'Υπό συνθήκες συζητάει και για ενοίκιο',
        model_type: self.model_types.find_by(name: 'properties'),
        sample: true
      }
      propertyb = properties.create!(sample_data_b)
      propertya = properties.create!(sample_data_a)

      extrasa = Extra.find([19, 20, 24, 31])
      propertya.extras << extrasa

      extrasb = Extra.find([18, 26, 28, 25])
      propertyb.extras << extrasb

      propertya.avatar.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_1.webp"),
        filename: "property_sample_1"
      )
      propertya.images.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_2.webp"),
        filename: "property_sample_2"
      )
      propertyb.avatar.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_3.webp"),
        filename: "property_sample_3"
      )
      propertyb.images.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_4.webp"),
        filename: "property_sample_4"
      )
    else
      sample_data_c = {
        title: '25 Hudson Yards #19D, New York, NY 10001',
        description: 'Take advantage of this unique opportunity to purchase this luxurious resale unit (no transfer taxes) with tons of upgrades (including window treatments, lighting upgrades, custom closets, customized bathroom hardware, and glass shower enclosure in the second bath) at an incredible price.',
        businesstype: :sell,
        category: Category.find(5),
        size: 1563,
        price: 4000000,
        bedrooms: 2,
        bathrooms: 3,
        floor: :"2",
        construction: 1990,
        address: '25 Hudson Yards',
        unit: '#19D',
        map_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.3840750732666!2d-74.00477298495468!3d40.75357654300857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259b43fb6e23d%3A0x2a0089cfcb71e0fe!2s25%20Hudson%20Yards%2C%20New%20York%2C%20NY%2010001%2C%20USA!5e0!3m2!1sen!2sgr!4v1651320937790!5m2!1sen!2sgr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        account: self,
        notes: 'Price negotiable but no lower than $3,800,000',
        availability: DateTime.current.to_date,
        ilocation: self.ilocations.create({ area: 'Hudson Yards' }),
        model_type: self.model_types.find_by(name: 'properties'),
        sample: true
      }
      sample_data_d = {
        title: '374 Broome St #4B, New York, NY 10013',
        description: 'This premier residence was thoughtfully updated to keep elements of the historic 19th century building, while incorporating the utmost in modern luxury, lifestyle and design.',
        businesstype: :sell,
        category: Category.find(5),
        size: 1970,
        price: 3495000,
        bedrooms: 1,
        bathrooms: 2,
        floor: :"4",
        construction: 1900,
        address: '374 Broome St',
        unit: '#4B',
        map_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.8907416459897!2d-73.99833418495567!3d40.72042164503779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25988f32a9a31%3A0x598ad62510090f1c!2s374%20Broome%20St%2C%20New%20York%2C%20NY%2010013%2C%20USA!5e0!3m2!1sen!2sgr!4v1651320972689!5m2!1sen!2sgr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        account: self,
        notes: 'Needs to go ASAP. Otherwise switching to rent',
        availability: DateTime.current.to_date,
        ilocation: self.ilocations.create({ area: 'Nolita' }),
        model_type: self.model_types.find_by(name: 'properties'),
        sample: true
      }
      propertyc = properties.create!(sample_data_c)
      propertyd = properties.create!(sample_data_d)
      # central heating, fireplace, clima and furnished
      extrasc = Extra.find([16, 23, 27, 22])
      extrasd = Extra.find([25])
      propertyc.extras << extrasc
      propertyd.extras << extrasd
      propertyc.avatar.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_1_en.webp"),
        filename: "property_sample_1_en"
      )
      propertyc.images.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_2_en.webp"),
        filename: "property_sample_2_en"
      )
      propertyd.avatar.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_3_en.webp"),
        filename: "property_sample_3_en"
      )
      propertyd.images.attach(
        io: File.open("#{ENV['MEDIA_DIR']}property_sample_4_en.webp"),
        filename: "property_sample_4_en"
      )
    end
  end

  def email_activate
    self.email_confirmed = true
    self.confirm_token = nil
    save!(:validate => false)
  end

  private

  def confirmation_token
    return unless self.confirm_token.blank?

    self.confirm_token = SecureRandom.urlsafe_base64.to_s
  end
end
