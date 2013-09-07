# == Schema Information
#
# Table name: tipo_productos
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class TipoProducto < ActiveRecord::Base
end
