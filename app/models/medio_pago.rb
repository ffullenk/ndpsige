# == Schema Information
#
# Table name: medio_pagos
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class MedioPago < ActiveRecord::Base
has_many :ventas
end
