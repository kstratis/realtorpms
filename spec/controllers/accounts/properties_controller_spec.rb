require 'rails_helper'

describe Accounts::PropertiesController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:property1) { FactoryBot.create(:property, account: account )}
  let(:property2) { FactoryBot.create(:property, account: account) }
  let(:property3) { FactoryBot.create(:property, account: account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }
  let(:country) { Country.create!(name: 'Greece', initials: 'GR', continent: 'EU') }
  let(:location) { Location.create(localname: "Λαμπρινή", globalname: "Lamprini", level: 3, parent_id: 2305, country_id: country.id, parent_localname: "Γαλάτσι", parent_globalname: "Galatsi") }

  before do
    use_categories_seed
    account.users << partners.first
    account.users << partners.second
    @request.host = "#{account.subdomain}.lvh.me"
    log_in(account_owner)
  end

  shared_examples 'its operations are successful' do

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    it 'redirects to js generated page with success message' do
      expect(subject).to render_template('shared/ajax/handler')
    end

    it 'makes sure the underlying object model has no errors' do
      subject
      expect(assigns(:property).errors).to be_empty
    end
  end

  describe 'GET #index' do
    subject { get :index, params: {}, format: :json }

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

  describe 'GET #new' do
    subject { get :new, params: {} }

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

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
    subject { post :create, params: params, format: :js }

    context 'when not enough parameters are provided' do

      context 'when category is missing' do
        let(:params) do
          { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                        description: 'A very nice residential villa',
                        locationid: location.id }
          }
        end

        it 'flashes an error message with category missing' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_category_missing'))
        end

        it 'redirects to new property page' do
          expect(subject).to redirect_to(new_property_path)
        end
      end

      context 'when location is missing' do
        let(:params) do
          { property: { subcategory: 'villa',
                        category: 'residential' } }
        end

        it 'flashes an error message with location missing' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_location_missing'))
        end

        it 'redirects to new property page' do
          expect(subject).to redirect_to(new_property_path)
        end
      end
    end

    context 'when enough parameters are provided' do
      let(:params) do
        { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                      description: 'A very nice residential villa',
                      category: 'residential',
                      subcategory: 'villa',
                      locationid: location.id }
        }
      end

      it_behaves_like 'its operations are successful'

      context 'when property owner is also provided' do
        let(:client) { FactoryBot.create(:client, account: account) }
        let(:params) do
          super_params = super()
          super()[:property].update(client: client)
          super_params
        end

        it_behaves_like 'its operations are successful'
      end

      context 'when property avatar is also provided' do
        let(:image_file) { fixture_file_upload(Rails.root.join('public', 'samples/semi_detached.jpg'), 'image/jpeg') }
        let(:params) do
          super_params = super()
          super()[:property].update(avatar: image_file)
          super_params
        end

        it "successfully uploads the property's avatar" do
          expect {
            subject
          }.to change(ActiveStorage::Attachment, :count).by(1)
        end
      end

      context 'when property images are also provided' do
        let(:image_file1) { fixture_file_upload(Rails.root.join('public', 'samples/apartment1.jpg'), 'image/jpeg') }
        let(:image_file2) { fixture_file_upload(Rails.root.join('public', 'samples/apartment2.jpg'), 'image/jpeg') }
        let(:params) do
          super_params = super()
          super()[:property].update(images: [image_file1, image_file2])
          super_params
        end

        it 'successfully uploads the property images' do
          expect {
            subject
          }.to change(ActiveStorage::Attachment, :count).by(2)
        end
      end
    end
  end


  describe 'GET #edit' do
    # property id could also be used here but we've manually disabled it in the controller.
    subject { get :edit, params: { id: property1.slug } }

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    context 'when logged in as a regular account user' do
      before do
        log_out
        log_in(account.users.first)
      end

      context 'who has not been assigned the property' do
        it 'flashes an error message with access denied' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('access_denied'))
        end

        it 'redirects to property index page' do
          expect(subject).to redirect_to(properties_path)
        end
      end
    end

  end

  describe 'PUT #update' do
    subject do
      put :update, params: params.merge(id: property1.slug), format: :js
    end

    context 'when not enough parameters are provided' do

      context 'when category is missing' do
        let(:params) do
          { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                        description: 'A very nice residential villa',
                        locationid: location.id }
          }
        end

        it 'flashes an error message with category missing' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_category_missing'))
        end

        it 'redirects to edit property page' do
          expect(subject).to redirect_to(edit_property_path(assigns(:property)))
        end
      end

      context 'when location is missing' do
        let(:params) do
          { property: { subcategory: 'villa',
                        category: 'residential' } }
        end

        it 'flashes an error message with location missing' do
          subject

          expect(subject.request.flash[:danger]).to eq(I18n.t('activerecord.attributes.property.flash_location_missing'))
        end

        it 'redirects to edit property page' do
          expect(subject).to redirect_to(edit_property_path(assigns(:property)))
        end
      end
    end

    context 'when enough parameters are provided' do
      let(:params) do
        { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                      description: 'A very nice residential apartment',
                      category: 'residential',
                      subcategory: 'apartment',
                      locationid: location.id }
        }
      end

      it_behaves_like 'its operations are successful'

      context 'when property owner is also provided' do
        let(:client) { FactoryBot.create(:client, account: account) }
        let(:params) do
          super_params = super()
          super()[:property].update(client: client)
          super_params
        end

        it_behaves_like 'its operations are successful'
      end

      context 'when property avatar is also provided' do
        let(:image_file) { fixture_file_upload(Rails.root.join('public', 'samples/semi_detached.jpg'), 'image/jpeg') }
        let(:params) do
          super_params = super()
          super()[:property].update(avatar: image_file)
          super_params
        end

        it "successfully uploads the property's avatar" do
          expect {
            subject
          }.to change(ActiveStorage::Attachment, :count).by(1)
        end
      end

      context 'when property images are also provided' do
        let(:image_file1) { fixture_file_upload(Rails.root.join('public', 'samples/apartment1.jpg'), 'image/jpeg') }
        let(:image_file2) { fixture_file_upload(Rails.root.join('public', 'samples/apartment2.jpg'), 'image/jpeg') }
        let(:params) do
          super_params = super()
          super()[:property].update(images: [image_file1, image_file2])
          super_params
        end

        it 'successfully uploads the property images' do
          expect {
            subject
          }.to change(ActiveStorage::Attachment, :count).by(2)
        end
      end
    end
  end

end

