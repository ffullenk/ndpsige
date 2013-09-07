class CreateProductos < ActiveRecord::Migration
  def change
    create_table :productos do |t|
      t.string :nombre
      t.references :tipoProducto, index: true
      t.integer :stock
      t.float :precio

      t.timestamps
    end
  end
end
