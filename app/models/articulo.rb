# == Schema Information
#
# Table name: articulos
#
#  id           :integer          not null, primary key
#  nombre       :string(255)
#  precio       :float
#  empresa_id   :integer
#  created_at   :datetime
#  updated_at   :datetime
#  proveedor_id :integer
#

class Articulo < ActiveRecord::Base
  belongs_to :empresa
  belongs_to :proveedor

  
end
