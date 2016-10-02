Rails.application.routes.draw do

  root 'sessions#login'

  resources :users do
    get :search, on: :collection
    get :action_plan, on: :member
    resource :portfolio, only: [:edit, :update, :show]
    resources :resume_entries, except: [:new, :edit]
    resources :meetings, except: [:new, :edit]
    resources :goals, except: [:new, :edit]
    resources :action_items, only: [:index, :update]
    resources :resources do
      post :change_category, on: :collection
    end
    resources :projects, except: [:index] do
      get :tags, on: :collection
      get :download, on: :member
    end
  end

  namespace :enrolls do
    post :bulk_create
  end
  
  resource :calendar, except: [:new, :edit, :show, :destroy] do
    get :manage
    get '/', action: :calendar
  end

  resource  :background_image, except: [:new, :edit, :show, :destroy] do
    get :manage
  end

  resources :class_periods
  resources :klasses, path: :class do
    get :user_index, on: :collection
    get :search, on: :collection
  end

  namespace :admin do
    get :dashboard
  end

  namespace :project_attachments do
    get 'download/:id', action: :download
  end

  namespace :sessions, path: '/', as: nil do
    post :login_authentication
    get  :access_student
    get  :access_admin
    get  :login
    get  :logout
  end

  get '/unfound', to: 'portfolios#unfound'
  get '/:username', to: 'portfolios#public'

end
