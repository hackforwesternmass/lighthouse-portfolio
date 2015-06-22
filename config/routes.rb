Rails.application.routes.draw do

  root "static_pages#home"

  # resources :courses

  resources :users do
    post 'add_courses', on: :member 
  	resources :portfolios
    resources :goals do
      resources :actions
      resources :courses
    end
    resources :activities
    resources :resources
    resources :projects
  end

  namespace :sessions, path: '/', as: nil do
    post 'login_authentication'
    get 'logout'
    get 'login'
  end

  get '/static_pages/calender'
  
end
