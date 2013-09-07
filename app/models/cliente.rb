# == Schema Information
#
# Table name: clientes
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Cliente < ActiveRecord::Base
end
