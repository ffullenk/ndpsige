class AddMediopagoToVentas < ActiveRecord::Migration
  def change
    add_column :ventas, :medio_pago_id, :integer
    add_index :ventas, :medio_pago_id
  end
end
