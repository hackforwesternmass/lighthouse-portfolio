Rails.application.routes.draw do

  root "static_pages#home"

  resources :users
  resources :courses
  resources :topics
  resources :resources
  resources :projects
  resources :goals
  resources :portfolios

  resources :users do 
  	resources :portfolios
    resources :goals
  end

  namespace :sessions, path: '/', as: nil do
    post 'login_authentication'
    get 'logout'
    get 'login'
  end

  get '/static_pages/calender'
  
end
