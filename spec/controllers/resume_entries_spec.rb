require 'rails_helper'

describe Users::ResumeEntriesController, type: :controller do
  let(:valid_attributes) { attributes_for(:resume_entry) }
  let(:resume_entry) { create(:resume_entry) }

  shared_examples('a user who can\'t manage resume_entries') do

    describe 'DELETE #destroy' do
      it 'denies access' do
        delete :destroy, user_id: resume_entry.user, id: resume_entry.id, format: :json
        expect(response).to have_http_status(403)
      end
    end

    describe 'PATCH #update' do
      it 'denies access' do
        patch :update, user_id: resume_entry.user, id: resume_entry.id, resume_entry: valid_attributes, format: :json
        expect(response).to have_http_status(403)
      end
    end
  end

  shared_examples('a user who can manage resume_entries') do
    describe 'POST #create' do

      it 'creates a new ResumeEntry' do
        resume_entry
        expect {
          post :create, user_id: resume_entry.user, resume_entry: valid_attributes, format: :json
        }.to change(ResumeEntry, :count).by(1)
      end

      it 'assigns a newly created resume_entry as @resume_entry' do
        post :create, user_id: resume_entry.user, resume_entry: valid_attributes, format: :json
        expect(assigns(:user)).to eq(resume_entry.user)
        expect(assigns(:resume_entry)).to be_a(ResumeEntry)
        expect(assigns(:resume_entry)).to be_persisted
      end

      it 'returns successfully' do
        post :create, user_id: resume_entry.user, resume_entry: valid_attributes, format: :json
        expect(response).to have_http_status(201)
      end
    end

    describe 'PATCH #update' do
      context 'with valid params' do
        let(:new_attributes) { attributes_for(:resume_entry, description: 'description') }

        it 'updates the requested resume_entry' do
          patch :update, user_id: resume_entry.user.id, id: resume_entry.id, resume_entry: new_attributes, format: :json
          resume_entry.reload
          expect(resume_entry.description).to eq('description')
        end

        it 'assigns the requested resume_entry as @resume_entry' do
          patch :update, user_id: resume_entry.user.id, id: resume_entry.id, resume_entry: valid_attributes, format: :json
          expect(assigns(:resume_entry)).to eq(resume_entry)
        end

        it 'returns successfully' do
          patch :update, user_id: resume_entry.user, id: resume_entry.id, resume_entry: valid_attributes, format: :json
          expect(response).to have_http_status(200)
        end
      end
    end

    describe 'DELETE #destroy' do
      it 'returns successfully' do
        delete :destroy, user_id: resume_entry.user, id: resume_entry.id, format: :json
        expect(response).to have_http_status(204)
      end
    end
  end

  shared_examples('a user who can view resume_entries') do

    describe 'GET #index' do
      it 'populates an array of resume entries' do
        get :index, user_id: resume_entry.user.id, format: :json
        expect(assigns(:resume_entries)).to match_array [resume_entry]
      end

      it 'populates a json of resume entries' do
        get :index, user_id: resume_entry.user.id, format: :json
        expect(response).to have_http_status(200)
      end
    end

    describe 'GET #show' do
      it 'assigns the requested resume_entry as @resume_entry' do
        get :show, user_id: resume_entry.user.id, id: resume_entry.id, format: :json
        expect(assigns(:resume_entry)).to eq(resume_entry)
      end
    end

    describe 'GET #show' do
      it 'renders show page' do
        get :show, user_id: resume_entry.user.id, id: resume_entry.id, format: :json
        expect(response).to render_template :show
      end
    end

  end

  shared_examples('a user who can\'t create a resume_entry') do

    describe 'POST #create' do
      it 'denies access' do
        post :create, user_id: resume_entry.user, resume_entry: valid_attributes, format: :json
        expect(response).to have_http_status(403)
      end
    end

  end

  context 'when not signed in' do
    it_behaves_like 'a user who can\'t create a resume_entry'
    it_behaves_like 'a user who can\'t manage resume_entries'
  end

  context 'when signed in as resume_entry owners parent' do
    before do
      @parent = create(:parent)
      resume_entry.user.parents << @parent
      sign_in(@parent)
    end

    it_behaves_like 'a user who can view resume_entries'
    it_behaves_like 'a user who can\'t create a resume_entry'
    it_behaves_like 'a user who can\'t manage resume_entries'
  end

  context 'when signed in as another student' do
    before { sign_in(create(:student)) }

    it_behaves_like 'a user who can\'t manage resume_entries'
  end

  context 'when signed in as a resume_entry owner student' do
    before { sign_in(resume_entry.user) }

    it_behaves_like 'a user who can view resume_entries'
    it_behaves_like 'a user who can manage resume_entries'
  end

  context 'when signed in as admin' do
    before { sign_in(create(:admin)) }

    it_behaves_like 'a user who can view resume_entries'
    it_behaves_like 'a user who can manage resume_entries'
  end
end
