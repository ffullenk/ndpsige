class AddProveedorToArticulo < ActiveRecord::Migration
  def change
    add_column :articulos, :proveedor_id, :integer
    add_index :articulos, :proveedor_id
  end
end
