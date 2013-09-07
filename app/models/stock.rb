# == Schema Information
#
# Table name: stocks
#
#  id              :integer          not null, primary key
#  articulo_id     :integer
#  cantidad        :float
#  precio_unitario :float
#  precio_total    :float
#  user_id         :integer
#  empresa_id      :integer
#  fecha_compra    :date
#  created_at      :datetime
#  updated_at      :datetime
#

class Stock < ActiveRecord::Base
  belongs_to :articulo
  belongs_to :user
  belongs_to :empresa
end
