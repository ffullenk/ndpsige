class CreateProveedors < ActiveRecord::Migration
  def change
    create_table :proveedors do |t|
      t.string :nombre
      t.string :telefono
      t.string :email
      t.string :web

      t.timestamps
    end
  end
end
