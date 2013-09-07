class Producto < ActiveRecord::Base
  belongs_to :tipoProducto

  has_many :productosales
  has_many :sales, through: :productosale
end
