class Productosale < ActiveRecord::Base
  belongs_to :producto
  belongs_to :sale

  attr_accesible :cantidad
end