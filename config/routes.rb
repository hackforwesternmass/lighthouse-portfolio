Rails.application.routes.draw do

  root "static_pages#home"

  resources :users
  resources :courses
  resources :topics

  namespace :sessions, path: '/', as: nil do
    post 'login_authentication'
    get 'logout'
    get 'login'
  end
  
end
