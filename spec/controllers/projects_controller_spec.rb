require 'rails_helper'

describe ProjectsController, type: :controller do
  let(:valid_attributes) { attributes_for(:project) }
  let(:invalid_attributes) { attributes_for(:project, title: nil) }
  let(:project) { create(:project) }
  let(:private_project) do
    project = create(:project)
    project.user.portfolio.update(private: true)
    project
  end

  shared_examples('a user who can manage a project') do

    describe 'POST #create' do
      context 'with valid params' do
        it 'creates a new Project' do
          project
          expect {
            post :create, user_id: project.user.id, project: valid_attributes
          }.to change(Project, :count).by(1)
        end

        it 'assigns a newly created project as @project' do
          post :create, user_id: project.user.id, project: valid_attributes
          expect(assigns(:project)).to be_a(Project)
          expect(assigns(:project)).to be_persisted
        end

        it 'for user redirects to the dashboard' do
          post :create, user_id: project.user.id, project: attributes_for(:project)
          expect(response).to redirect_to(user_projects_path(project.user))
        end
      end

      context 'with invalid params' do
        it 'assigns a newly created but unsaved project as @project' do
          post :create, user_id: project.user.id, project: invalid_attributes
          expect(assigns(:project)).to be_a_new(Project)
        end

        it 're-renders the \'new\' template' do
          post :create, user_id: project.user.id, project: invalid_attributes
          expect(response).to render_template('new')
        end
      end
    end

    describe 'GET #new' do
      it 'renders new page' do
        get :new, user_id: project.user.id
        expect(response).to render_template :new
      end
    end

    describe 'GET #edit' do
      it 'renders edit page' do
        get :edit, user_id: project.user.id, id: project.id
        expect(response).to render_template :edit
      end
    end

    describe 'PATCH #update' do
      context 'with valid params' do
        let(:new_attributes) { attributes_for(:project, description: 'description') }

        it 'updates the requested project' do
          patch :update, user_id: project.user.id, id: project.id, project: new_attributes
          project.reload
          expect(project.description).to eq('description')
        end

        it 'assigns the requested project as @project' do
          patch :update, user_id: project.user.id, id: project.id, project: valid_attributes
          expect(assigns(:project)).to eq(project)
        end

        it 'redirects to the user project' do
          patch :update, user_id: project.user.id, id: project.id, project: valid_attributes
          expect(response).to redirect_to(user_project_path(user_id: project.user.id, id: project.id))
        end
      end
    end

    describe 'DELETE #destroy' do
      it 'destroys the requested project' do
        new_project = project.user.projects.create(valid_attributes)
        expect {
          delete :destroy, user_id: project.user.id, id: new_project.id
        }.to change(Project, :count).by(-1)
      end

      it 'redirects to the projects list' do
        new_project = project.user.projects.create(valid_attributes)
        delete :destroy, user_id: project.user.id, id: new_project.id
        expect(response).to redirect_to(user_projects_path(project.user))
      end
    end

  end

  shared_examples('a user who can\'t create a project') do
    describe 'POST #create' do
      it 'denies access' do
        post :create, user_id: project.user.id, project: valid_attributes
        expect(response).to redirect_to(root_path)
      end
    end
  end

  shared_examples('a user who can\'t manage a project') do
    describe 'GET #edit' do
      it 'denies access' do
        get :edit, user_id: project.user.id, id: project.id
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'PATCH #update' do
      it 'denies access' do
        patch :update, user_id: project.user.id, id: project.id, project: valid_attributes
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'DELTE #destroy' do
      it 'denies access' do
        delete :destroy, user_id: project.user.id, id: project.id
        expect(response).to redirect_to(root_path)
      end
    end
  end

  shared_examples('a user who can view a project') do

    describe 'GET #index' do
      it 'populates an array of projects' do
        get :index, user_id: project.user.id
        expect(assigns(:projects)).to match_array [project]
      end
    end

    describe 'GET #index' do
      it 'renders index page' do
        get :index, user_id: project.user.id
        expect(response).to render_template :index
      end
    end

    describe 'GET #show' do
      it 'assigns the requested project as @project' do
        get :show, user_id: project.user.id, id: project.id
        expect(assigns(:project)).to eq(project)
      end
    end

    describe 'GET #show' do
      it 'renders show page' do
        get :show, user_id: project.user.id, id: project.id
        expect(response).to render_template :show
      end
    end

  end

  shared_examples('a user who can\'t view a private project') do
    describe 'GET #show' do
      it 'denies access' do
        get :show, user_id: private_project.user.id, id: private_project.id
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'GET #index' do
      it 'denies access' do
        get :index, user_id: private_project.user.id
        expect(response).to redirect_to(root_path)
      end
    end
  end

  context 'when not signed in' do
    it_behaves_like 'a user who can view a project'
    it_behaves_like 'a user who can\'t view a private project'
    it_behaves_like 'a user who can\'t create a project'
    it_behaves_like 'a user who can\'t manage a project'
  end

  context 'when signed in as project owners parent' do
    before do
      @parent = create(:parent)
      project.user.parents << @parent
      sign_in(@parent)
    end

    # describe 'GET #show' do
    #   it 'renders show page' do
    #     private_project.user.parents << @parent
    #     get :show, user_id: private_project.user.id, id: private_project
    #     expect(response).to render_template :show
    #   end
    # end

    it_behaves_like 'a user who can\'t create a project'
    it_behaves_like 'a user who can view a project'
    it_behaves_like 'a user who can\'t manage a project'
  end

  context 'when signed in as another student' do
    before { sign_in(create(:student)) }


    it_behaves_like 'a user who can view a project'
    it_behaves_like 'a user who can\'t view a private project'
    it_behaves_like 'a user who can\'t manage a project'
  end

  context 'when signed in as a project owner student' do
    before { sign_in(project.user) }

    it_behaves_like 'a user who can view a project'
    it_behaves_like 'a user who can manage a project'
  end

  context 'when signed in as admin' do
    before { sign_in(create(:admin)) }

    it_behaves_like 'a user who can view a project'
    it_behaves_like 'a user who can manage a project'
  end
end
