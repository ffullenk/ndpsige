class AddBoletaToVentas < ActiveRecord::Migration
  def change
    add_column :ventas, :boleta, :string
  end
end
