class AddTotalToSales < ActiveRecord::Migration
  def change
    add_column :sales, :total, :float
  end
end
