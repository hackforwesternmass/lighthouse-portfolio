Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    get :edit_profile
    get :unfound, on: :collection
    get :search, on: :collection
  end

  resources :projects do
    get :tags, on: :collection
    get :download, on: :member
    get :public, on: :member
  end

  resource  :calendar, except: [:new, :edit, :show, :destroy] do
    get :manage
    get "/", action: :calendar
  end

  resource  :background_image, except: [:new, :edit, :show, :destroy] do
    get :manage
  end


  resources :action_items
  resources :meetings
  resources :enrolls do
    post :bulk_create, on: :collection
  end
  resources :resume_entries
  resources :class_periods
  resources :goals
  resources :klasses, path: :class do
    get :user_index, on: :collection
    get :search, on: :collection
  end
  resources :resources do
    post :change_category, on: :collection
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

  namespace :action_plan, path: '/', as: nil do
    get :action_plan
  end

  get '/:username', to: 'users#profile'

end
