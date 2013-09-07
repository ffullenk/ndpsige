class CreateSales < ActiveRecord::Migration
  def change
    create_table :sales do |t|
      t.references :cajero, index: true
      t.references :cliente, index: true
      t.references :medioPago, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
