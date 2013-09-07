class CreateArticulos < ActiveRecord::Migration
  def change
    create_table :articulos do |t|
      t.string :nombre
      t.float :precio
      t.references :empresa, index: true

      t.timestamps
    end
  end
end
