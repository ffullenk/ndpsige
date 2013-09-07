class Sale < ActiveRecord::Base
  belongs_to :cajero
  belongs_to :cliente
  belongs_to :medioPago
  belongs_to :user

  has_many :productosales
  has_many :productos, through: :productosale
end
