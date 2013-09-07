class AddAnuladoToSales < ActiveRecord::Migration
  def change
    add_column :sales, :anulado, :boolean
  end
end
