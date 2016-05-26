require 'rails_helper'

describe UsersController, type: :controller do
  let(:valid_attributes)    {attributes_for(:user)}
  let(:admin)               {create(:admin)}
  let(:student)             {create(:student)}

  describe 'GET #index' do
    before do
      set_user_session(create(:admin))
    end

    it 'populates an array of students' do
      get :index
      student = create(:student)
      expect(assigns(:students)).to match_array [student]
    end

    it 'highlights \'Admin\' on side bar' do
      get :index
      expect(assigns(:highlight_sidebar)).to eq 'Admin'
    end

    it 'populates a json of students' do
      get :index, format: :json
      expect(response).to have_http_status(200)
    end
  end

end
