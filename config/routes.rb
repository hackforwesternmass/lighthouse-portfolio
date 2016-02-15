Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    get :edit_profile
    resources :projects do
    end
  end

  resource  :calendar, except: [:new, :edit, :show, :destroy] do 
    get :manage
    get "/", action: :calendar
  end
  resources :meetings
  resources :action_items
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
    get  :logout
    get  :login
  end

  namespace :action_plan, path: '/', as: nil do
    get :action_plan
  end

end
