require 'rails_helper'

describe Accounts::PropertiesController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:property1) { FactoryBot.create(:property, account: account) }
  let(:property2) { FactoryBot.create(:property, account: account) }
  let(:property3) { FactoryBot.create(:property, account: account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }

  before do
    use_categories_seed
    @request.host = "#{account.subdomain}.lvh.me"
    log_in(account_owner)
  end

  # shared_examples 'a guarded area for regular users' do |error|
  #   let(:userExternal) { FactoryBot.create(:userExternal) }
  #   before do
  #     account.users << userExternal
  #     log_out
  #     log_in(userExternal)
  #   end
  #   it 'redirects to home page with a success message' do
  #     expect(subject).to redirect_to(root_url)
  #     expect(subject.request.flash[:danger]).to eq(error)
  #   end
  # end

  describe 'GET #index' do
    subject { get :index, params: {}, format: :json }

    before do
      account.users << partners.first
      account.users << partners.second
    end

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    it "contains the total_pages attribute" do
      subject
      expect(JSON.parse(response.body)).to have_key('results_per_page')
    end

    it "contains the total_count attribute" do
      subject
      expect(JSON.parse(response.body)).to have_key('datalist')
    end

    it "contains the total_per_page attribute" do
      subject
      expect(JSON.parse(response.body)).to have_key('total_entries')
    end

    it "contains the total_per_page attribute" do
      subject
      expect(JSON.parse(response.body)).to have_key('current_page')
    end

    context 'when logged in as a regular account user' do
      before do
        log_out
        log_in(account.users.first)
      end

      it { is_expected.to be_successful }

      it { is_expected.to have_http_status(200) }
    end
  end

  describe 'POST #create' do
    subject { post :create, params: params }

    context 'when not enough parameters are provided' do

      context 'when category is missing' do
        let(:country) { Country.create!(name: 'Greece', initials: 'GR', continent: 'EU') }
        let(:location) { Location.create(localname: "Λαμπρινή", globalname: "Lamprini", level: 3, parent_id: 2305, country_id: country.id, parent_localname: "Γαλάτσι", parent_globalname: "Galatsi") }
        let(:params) do

          { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                        description: 'A very nice residential villa',
                        category: 'residential',
                        subcategory: 'villa',
                        locationid: location.id}
          }
        end

        it 'flashes an error message' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_location_missing'))
        end

        it 'redirects to new property page' do
          expect(subject).to redirect_to('/properties/new')
        end

      end

      context 'when location is missing' do
        let(:params) do
          { property: { subcategory: 'villa', category: 'residential',
                        description: Faker::Movies::Ghostbusters.quote } }
        end

        it 'renders new with error message about location' do
          expect(subject).to render_template(:new)
          expect(flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_location_missing'))
        end
      end

    end

    context 'when enough parameters are provided' do
      let(:country) { Country.create!(name: 'Greece', initials: 'GR', continent: 'EU') }
      let(:location) { Location.create(localname: "Λαμπρινή", globalname: "Lamprini", level: 3, parent_id: 2305, country_id: country.id, parent_localname: "Γαλάτσι", parent_globalname: "Galatsi") }
      let(:params) do

        { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                      description: 'A very nice residential villa',
                      category: 'residential',
                      subcategory: 'villa',
                      locationid: location.id}
        }
      end

      it { is_expected.to be_successful }

      it { is_expected.to have_http_status(200) }

      it 'redirects to show with a success message' do
        # expect(subject).to redirect_to(assigns(:user))
        # Make sure the newly created user belongs to the account of the user who created him/her
        # expect(assigns(:user).accounts.map(&:subdomain).first).to eq(account.subdomain)
        # expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_user_added'))
      end

      context 'when property owner is also provided' do
        let(:params)  do
          res = super()

          puts 'MERGING'
          # res[:property].update(filter_b: 'delicious')
          puts res
          res
        end

        it 'asdsd' do
          is_expected.to be_successful
        end

        it { is_expected.to have_http_status(200) }

      end

      context 'when property images are also provided' do

        # let(:params) { super().merge(filter_b: 'delicious') }
      end



    end
  end
end
