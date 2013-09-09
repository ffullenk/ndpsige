class AddEmpresaIdToCajero < ActiveRecord::Migration
  def change
    add_column :cajeros, :empresa_id, :integer
    add_index :cajeros, :empresa_id
  end
end
