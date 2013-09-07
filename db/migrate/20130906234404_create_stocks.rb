class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.references :articulo, index: true
      t.float :cantidad
      t.float :precio_unitario
      t.float :precio_total
      t.references :user, index: true
      t.references :empresa, index: true
      t.date :fecha_compra

      t.timestamps
    end
  end
end
