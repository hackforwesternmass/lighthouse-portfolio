Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    get :edit_profile
  end

  resources :projects do
    get :tags, on: :collection
    get :download, on: :member
  end

  resource  :calendar, except: [:new, :edit, :show, :destroy] do 
    get :manage
    get "/", action: :calendar
  end

  resource  :background_image, except: [:new, :edit, :show, :destroy] do 
    get :manage
  end

  resources :meetings
  resources :action_items, only: [:update, :destroy] do
    put :complete, on: :member
  end 
  resources :goals
  resources :klasses, path: :class
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

end
