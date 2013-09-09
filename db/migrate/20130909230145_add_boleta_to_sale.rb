class AddBoletaToSale < ActiveRecord::Migration
  def change
    add_column :sales, :boleta, :string
  end
end
