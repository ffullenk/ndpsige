# == Schema Information
#
# Table name: articulos
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  precio     :float
#  empresa_id :integer
#  created_at :datetime
#  updated_at :datetime
#

require 'spec_helper'

describe Articulo do
  pending "add some examples to (or delete) #{__FILE__}"
end
