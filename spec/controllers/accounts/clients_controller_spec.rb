require 'rails_helper'

describe Accounts::ClientsController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:client1) { FactoryBot.create(:client, account: account )}
  let(:client2) { FactoryBot.create(:client, account: account) }
  let(:client3) { FactoryBot.create(:client, account: account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 2) }

  before do
    use_categories_seed
    account.users << partners.first
    account.users << partners.second
    @request.host = "#{account.subdomain}.lvh.me"
    log_in(account_owner)
  end

  shared_examples 'access is denied' do
    it 'flashes an error message with access denied' do
      subject

      expect(subject.request.flash[:danger]).to eq(I18n.t('access_denied'))
    end

    it 'redirects to clients index page' do
      expect(subject).to redirect_to(clients_path)
    end
  end

  shared_examples 'its operations are successful' do

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    it 'makes sure the underlying object model has no errors' do
      subject
      expect(assigns(:client).errors).to be_empty
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
    subject { post :create, params: params }

    context 'when not enough parameters are provided' do
        let(:params) do
          { client: { first_name: 'John',
                      email: 'clientnew@gmail.com',
                      job: 'Builder',
                      notes: 'Looking for a semi detached',
                    }
          }
        end

        it 'renders new with error message' do
          expect(subject).to render_template(:new)
          expect(flash[:danger]).to eq(I18n.t('clients.flash_not_created'))
        end
    end

    context 'when enough parameters are provided' do
      let(:params) do
        { client: { first_name: 'John',
                    last_name: 'Smith',
                    email: 'clientnew@gmail.com',
                    job: 'Builder',
                    notes: 'Looking for a semi detached',
                  }
        }
      end

      it 'redirects to show with a success message' do
        expect(subject).to redirect_to(assigns(:client))
        # Make sure the newly created user belongs to the account of the user who created him/her
        expect(assigns(:client).account.subdomain).to eq(account.subdomain)
        expect(subject.request.flash[:success]).to eq(I18n.t('clients.flash_created'))
      end

    end

    context 'when logged in as a regular account user' do
      let(:params) do
        { client: { first_name: 'John',
                    last_name: 'Smith',
                    email: 'clientnew@gmail.com',
                    job: 'Builder',
                    notes: 'Looking for a semi detached',
                  }
        }
      end
      before do
        log_out
        log_in(account.users.first)
      end

      it 'redirects to show with a success message' do
        expect(subject).to redirect_to(assigns(:client))
        # Make sure the newly created client belongs to the account of the user who created him/her
        expect(assigns(:client).account.subdomain).to eq(account.subdomain)
        expect(subject.request.flash[:success]).to eq(I18n.t('clients.flash_created'))
      end

      it 'assigns the newly created client to the user' do
        subject

        expect(account.users.first.clients).to include(assigns(:client))
      end
    end
  end


  describe 'GET #edit' do
    # property id could also be used here but we've manually disabled it in the controller.
    subject { get :edit, params: { id: client1.id } }

    it { is_expected.to be_successful }

    it { is_expected.to have_http_status(200) }

    context 'when logged in as a regular account user who has not been assigned the property' do
      before do
        log_out
        log_in(account.users.first)
      end

      it_behaves_like 'access is denied'
    end

  end

  describe 'PUT #update' do
    subject { put :update, params: params.merge(id: client1.id) }

    context 'when not enough parameters are provided' do
      let(:params) do
        { client: { first_name: 'John',
                    last_name: '',
                    email: 'clientnew@gmail.com',
                    job: 'Builder',
                    notes: 'Looking for a semi detached'
                  }
        }
      end

      it 'renders new with error message' do
        expect(subject).to render_template(:edit)
        expect(flash[:danger]).to eq(I18n.t('clients.flash_not_updated'))
      end
    end

    context 'when enough parameters are provided' do
      let(:params) do
        { client: { first_name: 'David',
                    last_name: 'Smith',
                    email: 'davidb@gmail.com',
                    job: 'Builder',
                    notes: 'Looking for a semi detached',
        }
        }
      end

      it 'redirects to client page' do
        expect(subject).to redirect_to(client_path(assigns(:client)))
      end

      it 'makes sure the underlying object model has no errors' do
        subject
        expect(assigns(:client).errors).to be_empty
      end
    end

    context 'when logged in as a regular account user who has not been assigned the provided user' do
      let(:params) do
        { client: { first_name: 'George'} }
      end

      before do
        log_out
        log_in(account.users.first)
      end

      it_behaves_like 'access is denied'
    end
  end

  describe 'DELETE #destroy' do
    subject { delete :destroy, params: { id: client1.id } }

    context 'when deleting other clients' do
      it 'flashes an error message confirming property was deleted' do
        subject

        expect(subject.request.flash[:success]).to eq(I18n.t('clients.flash_delete'))
      end

      it 'redirects to property index page' do
        expect(subject).to redirect_to(clients_path)
      end

    end

    context 'when logged in as a regular account user who has not been assigned the property' do
      before do
        log_out
        log_in(account.users.first)
      end

      it_behaves_like 'access is denied'
    end
  end
end

