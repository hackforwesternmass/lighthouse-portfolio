Rails.application.routes.draw do

  root "static_pages#home"

  resources :users do 
  	resources :portfolios
  end

  namespace :sessions, path: '/', as: nil do
    post 'login_authentication'
    get 'logout'
    get 'login'
  end
  
end
