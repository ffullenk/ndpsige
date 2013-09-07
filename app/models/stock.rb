class Stock < ActiveRecord::Base
  belongs_to :articulo
  belongs_to :user
  belongs_to :empresa
end
