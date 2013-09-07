class AddCantidadToProductosale < ActiveRecord::Migration
  def change
    add_column :productosales, :cantidad, :float
  end
end
