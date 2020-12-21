require 'constraints/subdomain_required'

Rails.application.routes.draw do


  # get 'password_resets/new'
  # get 'password_resets/edit'

  get 'hello_world', to: 'hello_world#index'
  # get 'sessions/new'

  # get 'users/new'

  # resources :properties
  # resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
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
      get '/account-confirmation/:token', to: 'confirmations#confirm_email', as: :account_confirmation
      get '/properties/locations', to: 'properties#locations'
      get '/properties/clients', to: 'properties#clients'
      get '/properties/inlinesearch', to: 'properties#inlinesearch'
      # resources :entityfields
      resources :model_types, only: [:edit, :update], :path => "extended-fields"
      resources :settings, only: [:index]

      get '/inactive', to: 'lockout#show', as: :lockout
      # resources :model_types

      # favlists_path (GET, POST)
      # favlist_path (DELETE)
      resources :favlists, only: [:create, :destroy, :index, :show]
      post 'favorites', to: 'favlists#create_favorite'
      delete 'favorites', to: 'favlists#destroy_favorite'

      resources :properties do
        # resources :build, controller: 'property_steps'
        resource :favorites, only: [:create, :destroy]

        member do
          delete :delete_avatar
        end
      end

      resources :users do
        get '/masquerade/new', to: 'masquerades#new'
        delete '/masquerade', to: 'masquerades#destroy'

        delete :mass_delete, on: :collection
        post :mass_freeze, on: :collection

        member do
          patch :toggle_activation
          patch :toggle_adminify
          delete :delete_avatar
        end
      end

      resources :clients do
        delete :mass_delete, on: :collection
        post :mass_freeze, on: :collection
      end

      resources :invitations, only: [:new, :create, :check_existing_user]
      get '/invitations/validate_user', to:'invitations#check_existing_user', as: :invitation_validate
      # post '/properties/uploads', to: 'properties#uploads'
      # create a new assignment
      #
      #
      #
      get '/demo', to: 'properties#demo'

      post '/properties/uploads', to: 'properties#uploads'

      # i.e. /properties/21 - assign property to partner
      post '/assignments/property/:pid/users/', to: 'assignments#assign', as: :assignments
      get '/assignments/property/:pid/users/', to: 'assignments#assigned', as: :existing_assignments

      post '/assignments/user/:uid/properties/', to: 'assignments#properties_modal_assign', as: :properties_modal_assign
      get '/assignments/user/:uid/properties/', to: 'assignments#properties_modal_listing', as: :properties_modal_listing

      # i.e. /clients/25 - assign client to partner
      post '/clientships/client/:cid/users/', to: 'clientships#assign', as: :clientships
      get '/clientships/client/:cid/users/', to: 'clientships#assigned', as: :existing_clientships

      # i.e. /properties - assign search/state to client
      post '/matches/', to: 'matches#assign', as: :matches

      get '/showings', to: 'showings#index'
      post '/showings/', to: 'showings#create'
      delete '/showings/', to: 'showings#delete'
      #
      #post '/matches/', to: 'matches#assign', as: :matches


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

  get '/create', to: 'accounts#new', as: :new_account

  post '/create', to: 'accounts#create', as: :accounts

  get '/account/edit', to: 'accounts#edit', as: :account_edit

  patch '/account/edit', to: 'accounts#update', as: :account_update

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
