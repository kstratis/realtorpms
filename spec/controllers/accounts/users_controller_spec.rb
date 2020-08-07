require 'rails_helper'

describe Accounts::UsersController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }

  describe 'GET #index' do
    subject { get :index, params: {}, format: :json }

    before do
      @request.host = "#{account.subdomain}.lvh.me"
      log_in(account_owner)
      account.users << partners.first
      account.users << partners.second
      account.users << partners.third
      account.users << partners.fourth
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

  end

  describe 'POST #create' do
    subject { post :create, params: params }

    before do
      @request.host = "#{account.subdomain}.lvh.me"
      log_in(account_owner)
    end

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

      it 'redirects to show with a success message' do
        expect(subject).to redirect_to(assigns(:user))
        # Make sure the newly created user belongs to the account of the user who created him/her
        expect(assigns(:user).accounts.map(&:subdomain).first).to eq(account.subdomain)
        expect(subject.request.flash[:success]).to eq(I18n.t('users.flash_user_added'))
      end
    end
  end

  describe 'GET #edit' do
    subject { get :edit, params: { id: partners.first.id } }

    before do
      @request.host = "#{account.subdomain}.lvh.me"
      log_in(account_owner)
      account.users << partners.first
    end

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }
  end

  describe 'PUT #update' do
    before do
      @request.host = "#{account.subdomain}.lvh.me"
      log_in(account_owner)
      account.users << partners.first
    end

    context 'when updating other users' do
      subject { put :update, params: params.merge(id: partners.first.id) }


      context 'when parameters are missing' do
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

      context 'when existing email is used' do
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

      context 'when parameters are good' do
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
      context 'when parameters are missing' do
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

      context 'when parameters are good' do
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

      end
    end


  end
end

