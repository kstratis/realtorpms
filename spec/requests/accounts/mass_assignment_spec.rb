require "rails_helper"

RSpec.describe "Mass assignments", type: :request do
  let(:account) { FactoryBot.create(:account) }
  let(:account_owner) { account.owner }
  let(:partners) { FactoryBot.create_list(:usersequence, 10) }
  let(:country) { Country.create!(name: "Greece", initials: "GR", continent: "EU") }
  let(:location) { Location.create(localname: "Λαμπρινή", globalname: "Lamprini", level: 3, parent_id: 2305, country_id: country.id, parent_localname: "Γαλάτσι", parent_globalname: "Galatsi") }
  let(:json_response) { JSON.parse(response.body) }

  before do
    use_categories_seed
    account.users << partners.first
    account.users << partners.second
    account.users << partners.third
    # Don't delete - we may need this
    # host! "#{account.subdomain}.lvh.me"
  end

  context "when selecting multiple partners as admin" do
    before { sign_in_as(account_owner, account.subdomain) }
    let(:selection) { [partners&.first&.id&.to_s, partners&.second&.id&.to_s, partners&.third&.id&.to_s] }

    context "and toggle-freeze them" do
      it "is successful" do
        expect {
          post "/users/mass_freeze", params: {selection: selection}
        }.to change { Membership.where(user: selection, active: true).count }.by(-3)
      end

      it "returns the proper response" do
        post "/users/mass_freeze", params: {selection: selection}
        expect(json_response["meta"]).to eq(selection)
      end
    end

    context "and deletes them" do
      it "is successful" do
        expect {
          delete "/users/mass_delete", params: {selection: selection}
        }.to change { Membership.where(user: selection, active: true).count }.by(-3)
      end

      it "returns the proper response" do
        delete "/users/mass_delete", params: {selection: selection}
        expect(json_response["meta"]).to eq(selection)
      end
    end
  end

  context "when selecting multiple partners as a simple partner" do
    let(:selection) { [partners&.second&.id&.to_s, partners&.third&.id&.to_s] }

    before { sign_in_as(partners.first, account.subdomain) }

    subject { post "/users/mass_freeze", params: {selection: selection} }

    context "and toggle-freeze them" do
      it { is_expected.to redirect_to(root_path) }
      it "returns the proper response" do
        post "/users/mass_freeze", params: {selection: selection}
        expect(flash[:danger]).to eq(I18n.t("users.flash_owner_only_action"))
      end
    end

    context "and deletes them" do
      it { is_expected.to redirect_to(root_path) }

      it "returns the proper response" do
        delete "/users/mass_delete", params: {selection: selection}
        expect(flash[:danger]).to eq(I18n.t("users.flash_owner_only_action"))
      end
    end
  end
end
