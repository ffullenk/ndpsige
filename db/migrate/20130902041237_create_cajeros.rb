class CreateCajeros < ActiveRecord::Migration
  def change
    create_table :cajeros do |t|
      t.string :nombre

      t.timestamps
    end
  end
end
