class AddTotalToVentas < ActiveRecord::Migration
  def change
    add_column :ventas, :total, :float
  end
end
