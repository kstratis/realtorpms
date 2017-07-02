Rails.application.routes.draw do
  get 'main_pages/home'

  get 'main_pages/help'

  resources :properties
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'application#hello'
  # root 'users#index'
end
