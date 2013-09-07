Ndpsige::Application.routes.draw do
  resources :stocks

  resources :articulos

  resources :colaboradors

  resources :sales

  resources :medio_pagos


  resources :clientes

  resources :cajeros

  resources :productos

  resources :tipo_productos

  root :to => "home#index"
  devise_for :users, :path_prefix => 'auth'
end
