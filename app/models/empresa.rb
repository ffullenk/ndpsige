# == Schema Information
#
# Table name: empresas
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  ciudad     :string(255)
#  email      :string(255)
#  telefono   :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Empresa < ActiveRecord::Base

  has_many :colaboradors
  has_many :users
  has_many :productos
  has_many :stocks
  has_many :articulos
  has_many :cajeros
end
