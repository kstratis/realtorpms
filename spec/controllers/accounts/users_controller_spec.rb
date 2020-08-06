require 'rails_helper'

describe Accounts::UsersController, type: :controller do
  let(:account) { FactoryBot.create(:account) }
  let(:account_owner) {account.owner}
  let(:partners) { FactoryBot.create_list(:usersequence, 4) }

  before do
    log_in(account_owner)
    @request.host = "#{account.subdomain}.lvh.me"
  end

  describe 'GET #index' do
    subject { get :index, params: {}, format: :json }

    before do
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



end
