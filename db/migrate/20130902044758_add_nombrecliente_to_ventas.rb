class AddNombreclienteToVentas < ActiveRecord::Migration
  def change
    add_column :ventas, :nombrecliente, :string
  end
end
