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

require 'spec_helper'

describe Producto do
  pending "add some examples to (or delete) #{__FILE__}"
end
