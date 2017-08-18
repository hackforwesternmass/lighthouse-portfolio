require 'rails_helper'

describe Users::PortfoliosController, type: :controller do
  let(:valid_attributes) { attributes_for(:portfolio) }
  let(:portfolio) { create(:portfolio) }
  let(:student) { create(:student) }
  let(:admin) { create(:admin) }
  let(:private_portfolio) { create(:portfolio, private: true) }

  shared_examples('a user who can edit a portfolio') do

    describe 'GET #edit' do
      it 'renders edit page' do
        get :edit, user_id: portfolio.user.id
        expect(response).to render_template :edit
      end
    end

    describe 'PATCH #update' do
      context 'with valid params' do
        let(:new_attributes) { attributes_for(:portfolio, description: 'description') }

        it 'updates the requested portfolio' do
          patch :update, user_id: portfolio.user.id, portfolio: new_attributes
          portfolio.reload
          expect(portfolio.description).to eq('description')
        end

        it 'assigns the requested portfolio as @portfolio' do
          patch :update, user_id: portfolio.user.id, portfolio: valid_attributes
          portfolio.reload
          expect(assigns(:portfolio)).to eq(portfolio)
        end

        it 'redirects to the user portfolio' do
          patch :update, user_id: portfolio.user.id, portfolio: valid_attributes
          expect(response).to redirect_to(user_portfolio_path(portfolio.user))
        end
      end
    end

  end

  shared_examples('a user who can\'t edit a portfolio') do

    describe 'GET #edit' do
      it 'denies access' do
        get :edit, user_id: portfolio.user.id
        expect(response).to redirect_to(root_path)
      end
    end

    describe 'PATCH #update' do
      it 'denies access' do
        patch :update, user_id: portfolio.user.id, portfolio: valid_attributes
        expect(response).to redirect_to(root_path)
      end
    end

  end

  shared_examples('a user who can view a portfolio') do

    describe 'GET #show' do
      it 'assigns the requested portfolio as @portfolio' do
        get :show, user_id: portfolio.user.id
        expect(assigns(:portfolio)).to eq(portfolio)
      end
    end

    describe 'GET #show' do
      it 'renders show page' do
        get :show, user_id: portfolio.user.id
        expect(response).to render_template :show
      end
    end

  end

  shared_examples('a user who can\'t view a private portfolio') do
    describe 'GET #show' do
      it 'denies access' do
        get :show, user_id: private_portfolio.user.id
        expect(response).to redirect_to(root_path)
      end
    end
  end

  context 'when not signed in' do
    it_behaves_like 'a user who can view a portfolio'
    it_behaves_like 'a user who can\'t view a private portfolio'
    it_behaves_like 'a user who can\'t edit a portfolio'
  end

  context 'when signed in as portfolio owners parent' do
    before :each do
      @parent = create(:parent)
      portfolio.user.parents << @parent
      sign_in(@parent)
    end

    describe 'GET #show' do
      it 'renders show page' do
        private_portfolio.user.parents << @parent
        get :show, user_id: private_portfolio.user.id
        expect(response).to render_template :show
      end
    end

    it_behaves_like 'a user who can view a portfolio'
    it_behaves_like 'a user who can\'t edit a portfolio'
  end

  context 'when signed in as another student' do
    before :each do
      sign_in student
    end

    it_behaves_like 'a user who can view a portfolio'
    it_behaves_like 'a user who can\'t view a private portfolio'
    it_behaves_like 'a user who can\'t edit a portfolio'
  end

  context 'when signed in as a portfolio owner student' do
    before :each do
      sign_in portfolio.user
    end

    it_behaves_like 'a user who can view a portfolio'
    it_behaves_like 'a user who can edit a portfolio'
  end

  context 'when signed in as admin' do
    before :each do
      sign_in admin
    end

    it_behaves_like 'a user who can view a portfolio'
    it_behaves_like 'a user who can edit a portfolio'
  end
end
