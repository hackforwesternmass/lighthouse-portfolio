Rails.application.routes.draw do

  root 'sessions#login'

  resources :users do
    get :search, on: :collection
    get :action_plan, on: :member
    resource :portfolio, only: [:edit, :update, :show], module: :users
    resources :resume_entries, except: [:new, :edit], module: :users
    resources :meetings, except: [:new, :edit], module: :users
    resources :goals, except: [:new, :edit], module: :users
    resources :action_items, only: [:index, :update], module: :users
    resources :klasses, path: :classes, only: [:index, :update], module: :users
    resources :feedbacks, module: :users
    resources :resources, module: :users do
      post :change_category, on: :collection
    end
    resources :projects, except: [:index], module: :users do
      get :tags, on: :collection
      get :download, on: :member
    end
  end

  resources :enrolls, only: [:create, :update, :destroy]

  resources :class_periods
  resources :klasses, path: :class

  namespace :admin do
    get :dashboard
  end

  resource :application_settings, only: [:show, :edit, :update], module: :admin

  get '/calendar', to: 'admin/application_settings#calendar'


  resources :parents, only: [:index, :create] do
    get :dashboard, on: :collection
  end

  namespace :project_attachments do
    get 'download/:id', action: :download
  end

  namespace :sessions, path: '/', as: nil do
    post :login_authentication
    get  :access_student
    get  :exit_student
    get  :login
    get  :logout
    get  :forgot_password
    post :forgot_password
  end

  get '/unfound', to: 'portfolios#unfound'
  get '/:username', to: 'portfolios#public'

end
