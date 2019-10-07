require 'rails_helper'

RSpec.describe "ModelTypes", type: :request do
  describe "GET /model_types" do
    it "works! (now write some real specs)" do
      get model_types_path
      expect(response).to have_http_status(200)
    end
  end
end
