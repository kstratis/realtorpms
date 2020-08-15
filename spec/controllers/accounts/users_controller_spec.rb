require 'rails_helper'

describe Accounts::UsersController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }

  before do
    @request.host = "#{account.subdomain}.lvh.me"
    log_in(account_owner)
  end

  shared_examples 'a guarded area for regular users' do |error|
    let(:userExternal) { FactoryBot.create(:userExternal) }
    before do
      account.users << userExternal
      log_out
      log_in(userExternal)
    end
    it 'redirects to home page with a success message' do
      expect(subject).to redirect_to(root_url)
      expect(subject.request.flash[:danger]).to eq(error)
    end
  end

  describe 'GET #index' do
    subject { get :index, params: {}, format: :json }

    before do
      account.users << partners.first
      account.users << partners.second
      account.users << partners.third
      account.users << partners.fourth
    end

    it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_owner_only_action')

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
  end

  describe 'POST #create' do
    subject { post :create, params: params }

    context 'when not enough parameters are provided' do
      let(:params) do
        { user: { first_name: '',
                  last_name: '',
                  email: '',
                  phone1: '',
                  dob: Date.new(1980, 4, 1),
                  password: '',
                  password_confirmation: '' } }
      end

      it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_owner_only_action')

      it 'renders new with error message' do
        expect(subject).to render_template(:new)
        expect(flash[:danger]).to eq(I18n.t('users.flash_user_add_failed'))
      end
    end

    context 'when parameters are good' do
      let(:params) do
        { user: { first_name: 'Hulk',
                  last_name: 'Hogan',
                  email: 'hh@gmail.com',
                  phone1: '6935567342',
                  dob: Date.new(1980, 4, 1),
                  password: 'abc123',
                  password_confirmation: 'abc123' } }
      end

      it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_owner_only_action')

      it 'redirects to show with a success message' do
        expect(subject).to redirect_to(assigns(:user))
        # Make sure the newly created user belongs to the account of the user who created him/her
        expect(assigns(:user).accounts.map(&:subdomain).first).to eq(account.subdomain)
        expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_user_added'))
      end

      it 'yolo' do
        expect(subject).to redirect_to('/users/new')
      end
    end
  end

  describe 'GET #edit' do
    subject { get :edit, params: { id: partners.first.id } }

    before { account.users << partners.first }

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_unauthorised_user_edit')
  end

  describe 'PUT #update' do

    before { account.users << partners.first }

    context 'when updating other users' do
      subject { put :update, params: params.merge(id: partners.first.id) }

      context 'and parameters are missing' do
        let(:params) do
          { user: { first_name: '',
                    last_name: '',
                    email: '',
                    phone1: '',
                    dob: Date.new(1980, 4, 1),
                    password: '',
                    password_confirmation: '' } }
        end

        it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_unauthorised_user_edit')

        it 'renders edit with error message' do
          expect(subject).to render_template(:edit)
          expect(flash[:danger]).to eq(I18n.t('users.flash_user_update_failed'))
        end

      end

      context 'and existing email is used' do
        let(:params) do
          { user: { first_name: 'Jane',
                    last_name: 'Smith',
                    email: account_owner.email,
                    phone1: '',
                    dob: Date.new(1980, 4, 1),
                    password: '',
                    password_confirmation: '' } }
        end

        it 'renders edit with error message ' do
          expect(subject).to render_template(:edit)
          expect(flash[:danger]).to eq(I18n.t('users.flash_user_update_failed'))
        end
      end

      context 'and parameters are good' do
        let(:params) do
          { user: { first_name: 'John',
                    last_name: 'Scruggs',
                    email: 'jc1@gmail.com',
                    phone1: '6935567342',
                    dob: Date.new(1980, 4, 1),
                    password: 'abc123',
                    password_confirmation: 'abc123' } }
        end

        it 'redirects to show with a success message' do
          expect(subject).to redirect_to(assigns(:user))
          # Make sure the newly created user belongs to the account of the user who created him/her
          expect(assigns(:user).accounts.map(&:subdomain).first).to eq(account.subdomain)
          expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_profile_updated'))
        end
      end
    end

    context 'when updating self' do
      subject { put :update, params: params.merge(id: account_owner.id) }

      context 'and parameters are missing' do
        let(:params) do
          { user: { first_name: '',
                    last_name: '',
                    email: '',
                    phone1: '',
                    dob: Date.new(1980, 4, 1),
                    password: '',
                    password_confirmation: '' } }
        end

        it 'renders edit with error message' do
          expect(subject).to render_template(:edit)
          expect(flash[:danger]).to eq(I18n.t('users.flash_user_update_failed'))
        end
      end

      context 'and parameters are good' do
        let(:params) do
          { user: { first_name: 'John',
                    last_name: 'Scruggs',
                    email: 'jc1@gmail.com',
                    phone1: '6935567342',
                    dob: Date.new(1980, 4, 1),
                    password: 'abc123',
                    password_confirmation: 'abc123' } }
        end

        it 'redirects to show with a success message' do
          expect(subject).to redirect_to(assigns(:user))
          expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_profile_updated'))
        end

        context 'and is a regular user' do
          let(:userExternal) { FactoryBot.create(:userExternal) }
          subject { put :update, params: params.merge(id: userExternal.id) }

          before do
            account.users << userExternal
            log_out
            log_in(userExternal)
          end

          it 'redirects to home page with a success message' do
            expect(subject).to redirect_to(assigns(:userExternal))
            expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_profile_updated'))
          end
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    before { account.users << partners.first }

    context 'when deleting other users' do
      subject { delete :destroy, params: { id: partners.first.id } }

      it_behaves_like 'a guarded area for regular users', I18n.t('users.flash_owner_only_action')

      it 'changes the count of the account users' do
        expect do
          subject
        end.to change {
          account.users.count
        }.by(-1)
      end

      it 'destroys the configuration' do
        subject

        expect(account.users.where(id: partners.first.id).any?).to be_falsey
      end

      it 'redirects to index page successfully' do
        subject

        expect(response).to redirect_to(users_path)
      end

      it 'flashes a success message' do
        subject

        expect(subject.request.flash[:success]).to eq(I18n.t 'users.flash_delete')
      end
    end
  end
end

