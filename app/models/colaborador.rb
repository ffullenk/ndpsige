# == Schema Information
#
# Table name: colaboradors
#
#  id         :integer          not null, primary key
#  nombre     :string(255)
#  telefono   :string(255)
#  email      :string(255)
#  empresa_id :integer
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class Colaborador < ActiveRecord::Base
  belongs_to :empresa
  belongs_to :user
end
