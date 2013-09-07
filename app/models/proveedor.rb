# == Schema Information
#
# Table name: proveedors
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  telefono   :string(255)
#  email      :string(255)
#  web        :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Proveedor < ActiveRecord::Base

	has_many :articulos
end
