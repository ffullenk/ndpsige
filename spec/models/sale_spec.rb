# == Schema Information
#
# Table name: sales
#
#  id            :integer          not null, primary key
#  cajero_id     :integer
#  cliente_id    :integer
#  medioPago_id  :integer
#  user_id       :integer
#  created_at    :datetime
#  updated_at    :datetime
#  fecha         :datetime
#  anulado       :boolean
#  telefonico    :boolean
#  pagopendiente :boolean          default(FALSE), not null
#  boleta        :string(255)
#  total         :float
#

require 'spec_helper'

describe Sale do
  pending "add some examples to (or delete) #{__FILE__}"
end
