Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    resources :resources do
      post :change_category, on: :collection
    end
    resources :projects do
    end
  end

  resources :meetings
  resources :action_items

  namespace :project_attachments do
    get 'download/:id', action: :download
  end

  namespace :sessions, path: '/', as: nil do
    post :login_authentication
    get  :logout
    get  :login
  end

  namespace :calendar, path: '/', as: nil do
    get :calendar
  end

  namespace :action_plan, path: '/', as: nil do
    get :action_plan
  end

end
