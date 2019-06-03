require 'constraints/subdomain_required'

Rails.application.routes.draw do


  # get 'password_resets/new'
  # get 'password_resets/edit'

  get 'hello_world', to: 'hello_world#index'
  # get 'sessions/new'

  # get 'users/new'

  # resources :properties
  # resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # root 'application#hello'
  # root 'users#index'
  #
  get 'password/request/new', to: 'password_resets#new', as: :password_reset_request_new
  post 'password/request/new', to: 'password_resets#create', as: :password_reset_request_create
  get 'password/:id/reset', to: 'password_resets#edit', as: :password_reset_edit
  patch 'password/:id/reset', to: 'password_resets#update', as: :password_reset_update
  # resources :password_resets, only: [:new, :create, :edit, :update]


  # root 'main_pages#home'
  constraints(SubdomainRequired) do
    scope module: 'accounts' do
      root to: 'dashboard#index', as: :account_root
      get '/properties/locations', to: 'properties#locations'
      get '/properties/owners', to: 'properties#owners'



      resources :properties do
        # resources :build, controller: 'property_steps'
        resource :favorites, only: [:create, :destroy]




        member do
          delete :delete_avatar
        end
      end

      resources :users do
        resources :favlists, only: [:create, :destroy, :index]
        member do
          patch :toggle_activation
          delete :delete_avatar
        end
      end


      resources :invitations, only: [:new, :create, :check_existing_user]
      get '/invitations/validate_user', to:'invitations#check_existing_user', as: :invitation_validate
      # post '/properties/uploads', to: 'properties#uploads'
      # create a new assignment
      #
      #

      post '/properties/uploads', to: 'properties#uploads'
      #
      post '/assignments/property/:pid/user/:uid', to: 'assignments#create'
      # delete an existing assignment
      delete '/assignments/property/:pid/user/:uid', to: 'assignments#destroy'

      # resources :invitations, only: [:new, :create] do
      #   member do
      #     get :accept
      #     patch :accepted
      #   end
      # end

      # resources :invitations, only: [:new, :create]
    end
  end


  root to: 'home#index'

  get '/switch/', to:'home#switch', as: :account_switch
  get '/accounts/', to:'home#accounts', as: :account_list

  get '/accounts/new', to: 'accounts#new', as: :new_account

  post '/accounts/new', to: 'accounts#create', as: :accounts
  # post '/accounts', to: 'accounts#create', as: :accounts

  get  '/help', to: 'main_pages#help'
  get  '/about', to: 'main_pages#about'
  get  '/contact', to: 'main_pages#contact'
  get  '/signup',  to: 'users#new'

  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'

  get '/invitations/:id/accept', to: 'invitationreceivers#accept', as: :accept_invitation
  patch '/invitations/:id/accepted', to: 'invitationreceivers#accepted', as: :accepted_invitation





  # root 'application#hello'
end
