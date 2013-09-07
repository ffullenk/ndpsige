class CreateProductosales < ActiveRecord::Migration
  def change
    create_table :productosales do |t|
      t.references :producto, index: true
      t.references :sale, index: true

      t.timestamps
    end
  end
end
