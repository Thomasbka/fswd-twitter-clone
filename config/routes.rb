Rails.application.routes.draw do
  root 'homepage#index'

  namespace :api do
    resources :feeds, only: [:index]
    resources :tweets, only: [:index, :create, :destroy]
    resources :users, param: :username, only: [:show, :create] do
      member do
        get :tweets
      end
    end
    resources :sessions, only: [:create, :destroy] do
      collection do
        get :authenticated
      end
    end
  end

  get '*path', to: 'homepage#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
