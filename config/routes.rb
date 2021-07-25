require 'constraints/subdomain_required'

Rails.application.routes.draw do

  constraints(SubdomainRequired) do
    scope module: 'accounts' do
      # Language support on client mini websites
      scope ":locale", locale: /en|el/ do
        root to: 'websites#index', as: :websites_root
        get '/properties/:id', to: 'websites#show', as: :website_property
      end
      get '/results-count', to: 'websites#count', as: :results_count

      # Admin area
      scope 'app' do
        root to: 'dashboard#index', as: :account_root
        get '/account-confirmation/:token', to: 'confirmations#confirm_email', as: :account_confirmation
        get '/properties/locations', to: 'properties#locations'
        get '/properties/clients', to: 'properties#clients'
        get '/properties/inlinesearch', to: 'properties#inlinesearch'
        # resources :entityfields
        resources :model_types, only: [:edit, :update], :path => "extended-fields"
        resources :settings, only: [:index]

        resources :calendar_events, only: [:create, :show, :index, :destroy]

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
            post :clone
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
            patch :toggle_tour
            delete :delete_avatar
          end
        end

        resources :clients do
          delete :mass_delete, on: :collection
          post :mass_freeze, on: :collection
        end

        resources :invitations, only: [:new, :create, :check_existing_user]
        get '/invitations/validate_user', to: 'invitations#check_existing_user', as: :invitation_validate

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
      end
    end
  end

  get '/switch/', to: 'home#switch', as: :account_switch
  get '/accounts/', to: 'home#accounts', as: :account_list

  get '/account/edit', to: 'accounts#edit', as: :account_edit

  patch '/account/edit', to: 'accounts#update', as: :account_update

  delete '/account/delete_avatar', to: 'accounts#delete_avatar', as: :delete_avatar_account

  get '/invitations/:id/accept', to: 'invitationreceivers#accept', as: :accept_invitation
  patch '/invitations/:id/accepted', to: 'invitationreceivers#accepted', as: :accepted_invitation

  # Language support on website (landing) pages
  scope ":locale", locale: /en|el/ do
    root to: 'home#index', as: :landing_root
    get '/create', to: 'accounts#new', as: :new_account

    post '/create', to: 'accounts#create', as: :accounts
    get '/login', to: 'sessions#new'
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'

    get 'password/request/new', to: 'password_resets#new', as: :password_reset_request_new
    post 'password/request/new', to: 'password_resets#create', as: :password_reset_request_create
    get 'password/:id/reset', to: 'password_resets#edit', as: :password_reset_edit
    patch 'password/:id/reset', to: 'password_resets#update', as: :password_reset_update
  end

  match '*path',
        to: redirect(status: 302) { |_, request| locale_handler(request) },
        constraints: lambda { |req| constraint_handler(req) },
        via: :get

  match '', to: redirect(status: 302) { |_, request| request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first },
        constraints: lambda { |req| req.path.exclude? 'rails/active_storage' },
        via: :get
end

# Returns `true` if redirection should continue otherwise `false`
# @param request [ActionController::Parameters] The client request
#
# @return [Boolean] Whether the constraint should be skipped or not
def constraint_handler(request)
  # Don't do anything if the given route is active storage related
  return false if request.path.include?('rails/active_storage')

  locale = request.path.scan(/^\/([a-z]{2})/).flatten.first

  # If we already have a locale prefix in our path (`/en/unknown`), stop redirecting any further cause
  # we may cause an infinite redirection loop
  return false if %w[en el].include?(locale)

  # In the general scenario, redirect
  true
end

# If no locale prefix is present (i.e. `/unknown`), then redirect using the locale taken from the `HTTP_ACCEPT_LANGUAGE`
# header given its English or Greek. Default to English otherwise.
#
# @param request [ActionController::Parameters] The client request
#
# @return [String] The path to redirect to
def locale_handler(request)
  locale = request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first
  if %w[en el].include?(locale)
    "#{locale}#{request.path}"
  else
    "#{I18n.default_locale}#{request.path}"
  end
end
