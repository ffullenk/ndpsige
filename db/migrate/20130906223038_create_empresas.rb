class CreateEmpresas < ActiveRecord::Migration
  def change
    create_table :empresas do |t|
      t.string :nombre
      t.string :ciudad
      t.string :email
      t.string :telefono

      t.timestamps
    end
  end
end
