# == Schema Information
#
# Table name: productosales
#
#  id          :integer          not null, primary key
#  producto_id :integer
#  sale_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  cantidad    :float
#

class Productosale < ActiveRecord::Base
  belongs_to :producto
  belongs_to :sale
  
end
