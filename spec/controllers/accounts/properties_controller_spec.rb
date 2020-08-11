require 'rails_helper'

describe Accounts::PropertiesController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:property1) { FactoryBot.create(:property, account: account) }
  let(:property2) { FactoryBot.create(:property, account: account) }
  let(:property3) { FactoryBot.create(:property, account: account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }

  before do
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
    let(:category) { Category.find((5..32).to_a.sample) }
    let(:location) { Location.find(102723) }

    subject { post :create, params: params }

    context 'when not enough parameters are provided' do

      let(:params) do
        { property: { businesstype: [:sell, :rent, :sell_rent].sample,
                      description: Faker::Movies::Ghostbusters.quote }
        }
      end

      it 'renders new with error message' do
        expect(subject).to render_template(:new)
        expect(flash[:danger]).to eq(I18n.t('users.flash_user_add_failed'))
      end



    end
  end
end
