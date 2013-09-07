class AddTelefonicoToSales < ActiveRecord::Migration
  def change
    add_column :sales, :telefonico, :boolean
  end
end
