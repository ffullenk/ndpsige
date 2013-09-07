class CreateColaboradors < ActiveRecord::Migration
  def change
    create_table :colaboradors do |t|
      t.string :nombre
      t.string :telefono
      t.string :email
      t.references :empresa, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
