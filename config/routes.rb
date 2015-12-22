Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    resources :resources do
      post :change_category, on: :collection
    end
    resources :projects do
    end
  end

  namespace :project_attachments do
    get 'download/:id', to: :download
  end

  namespace :sessions, path: '/', as: nil do
    post :login_authentication
    get  :logout
    get  :login
  end

  namespace :calendar, path: '/', as: nil do
    get :calendar
  end


end
