require 'rails_helper'

describe UsersController, type: :controller do
  let(:valid_attributes) { attributes_for(:user) }
  let(:invalid_attributes) { attributes_for(:user, first_name: nil) }
  let(:user) { create(:user) }
  let(:admin) { create(:admin) }
  let(:student) { create(:student) }
  let(:parent) { create(:parent) }

  shared_examples('a user who can manage users') do
    describe 'GET #index' do
      it 'populates an array of students' do
        get :index
        student = create(:student)
        expect(assigns(:users)).to match_array [student]
      end

      it 'populates a json of students' do
        get :index, format: :json
        expect(response).to have_http_status(200)
      end
    end

    describe 'POST #create' do
      context 'with valid params' do
        it 'creates a new User' do
          expect {
            post :create, user: valid_attributes
          }.to change(User, :count).by(1)
        end

        it 'assigns a newly created user as @user' do
          post :create, user: valid_attributes
          expect(assigns(:user)).to be_a(User)
          expect(assigns(:user)).to be_persisted
        end

        it 'for student redirects to the dashboard' do
          post :create, user: attributes_for(:user)
          expect(response).to redirect_to(users_path)
        end

        it 'for admin redirects to the dashboard' do
          post :create, user: attributes_for(:admin)
          expect(response).to redirect_to(admin_dashboard_path)
        end

        it 'for parent redirects to the user index' do
          post :create, user: attributes_for(:parent)
          expect(response).to redirect_to(users_path)
        end
      end

      context 'with invalid params' do
        it 'assigns a newly created but unsaved user as @user' do
          post :create, user: invalid_attributes
          expect(assigns(:user)).to be_a_new(User)
        end

        it 're-renders the \'new\' template' do
          post :create, user: invalid_attributes
          expect(response).to render_template('new')
        end
      end
    end

    describe 'PATCH #update' do
      context 'with valid params' do
        let(:new_attributes) { attributes_for(:user, first_name: 'Menelik') }

        it 'updates the requested user' do
          patch :update, id: user.id, user: new_attributes
          user.reload
          expect(user.first_name).to eq('Menelik')
        end

        it 'assigns the requested user as @user' do
          patch :update, id: user.id, user: valid_attributes
          expect(assigns(:user)).to eq(user)
        end

        it 'redirects to the dashboard' do
          patch :update, id: user.id, user: valid_attributes
          expect(response).to redirect_to(users_path)
        end
      end

      context 'with invalid params' do
        it 'assigns the user as @user' do
          patch :update, id: user.id, user: invalid_attributes
          expect(assigns(:user)).to eq(user)
        end

        it 're-renders the \'edit\' template' do
          patch :update, id: user.id, user: invalid_attributes
          expect(response).to render_template('edit')
        end
      end
    end
  end

  shared_examples('a user who can\'t manage users') do
    describe 'GET #index' do
      it 'denies access' do
        get :index
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'GET #new' do
      it 'denies access' do
        get :new
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'GET #edit' do
      it 'denies access' do
        get :edit, id: user.id
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'POST #create' do
      it 'denies access' do
        post :create, user: attributes_for(:user)
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'PATCH #update' do
      it 'denies access' do
        patch :update, id: user.id, user: valid_attributes
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'DELETE #destroy' do
      it 'denies access' do
        delete :destroy, id: user.id
        expect(response).to redirect_to(root_path)
      end
    end
  end

  context 'when not signed in' do
    it_behaves_like 'a user who can\'t manage users'
  end

  context 'when signed in as a parent' do
    before { sign_in(parent) }
    it_behaves_like 'a user who can\'t manage users'
  end

  context 'when signed in as a student' do
    before { sign_in(student) }
    it_behaves_like 'a user who can\'t manage users'
  end

  context 'when signed in as admin' do
    before { sign_in(admin) }
    it_behaves_like 'a user who can manage users'
  end
end
