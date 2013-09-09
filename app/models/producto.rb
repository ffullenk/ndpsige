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
#  empresa_id      :integer
#

class Producto < ActiveRecord::Base
  belongs_to :tipoProducto
  belongs_to :empresa
  has_many :productosales
  has_many :sales, through: :productosale
end
