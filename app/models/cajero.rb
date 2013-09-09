# == Schema Information
#
# Table name: cajeros
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  created_at :datetime
#  updated_at :datetime
#  empresa_id :integer
#

class Cajero < ActiveRecord::Base

	belongs_to :empresa
	
end
