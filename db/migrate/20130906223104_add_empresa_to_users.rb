class AddEmpresaToUsers < ActiveRecord::Migration
  def change
    add_column :users, :empresa_id, :integer
    add_index :users, :empresa_id
  end
end
