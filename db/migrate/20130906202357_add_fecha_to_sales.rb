class AddFechaToSales < ActiveRecord::Migration
  def change
    add_column :sales, :fecha, :datetime
  end
end
