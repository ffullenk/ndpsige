# == Schema Information
#
# Table name: cajeros
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Cajero < ActiveRecord::Base
end
