Rails.application.routes.draw do

  root "sessions#login"

  resources :users do
    resources :resources do
      post :change_category, on: :collection
    end
    resources :projects
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
