class Empresa < ActiveRecord::Base

  has_many :colaboradors
  has_many :users
  has_many :productos
  has_many :stocks
  has_many :articulos
end
