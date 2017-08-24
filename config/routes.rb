require 'constraints/subdomain_required'

Rails.application.routes.draw do


  # get 'sessions/new'

  # get 'users/new'

  # resources :properties
  # resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # root 'application#hello'
  # root 'users#index'

  # root 'main_pages#home'
  constraints(SubdomainRequired) do
    scope module: 'accounts' do
      root to: 'dashboard#index', as: :account_root
      resources :properties
      resources :users
    end
  end


  root to: 'home#index'

  get '/accounts/new', to: 'accounts#new', as: :new_account
  post '/accounts', to: 'accounts#create', as: :accounts

  get  '/help', to: 'main_pages#help'
  get  '/about', to: 'main_pages#about'
  get  '/contact', to: 'main_pages#contact'
  get  '/signup',  to: 'users#new'

  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'


  # root 'application#hello'
end
