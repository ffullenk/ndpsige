# == Schema Information
#
# Table name: sales
#
#  id           :integer          not null, primary key
#  cajero_id    :integer
#  cliente_id   :integer
#  medioPago_id :integer
#  user_id      :integer
#  created_at   :datetime
#  updated_at   :datetime
#  fecha        :datetime
#  anulado      :boolean
#  telefonico   :boolean
#

class Sale < ActiveRecord::Base
  belongs_to :cajero
  belongs_to :cliente
  belongs_to :medioPago
  belongs_to :user

  has_many :productosales
  has_many :productos, through: :productosale
end
