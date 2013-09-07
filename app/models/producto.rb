# == Schema Information
#
# Table name: productos
#
#  id              :integer          not null, primary key
#  nombre          :string(255)
#  tipoProducto_id :integer
#  stock           :integer
#  precio          :float
#  created_at      :datetime
#  updated_at      :datetime
#

class Producto < ActiveRecord::Base
  belongs_to :tipoProducto

  has_many :productosales
  has_many :sales, through: :productosale
end
