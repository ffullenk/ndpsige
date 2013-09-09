class AddPagopendienteToSales < ActiveRecord::Migration
  def change
    add_column :sales, :pagopendiente, :boolean, :null=> false, :default => false
  end
end
