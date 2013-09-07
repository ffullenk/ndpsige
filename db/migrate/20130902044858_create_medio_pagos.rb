class CreateMedioPagos < ActiveRecord::Migration
  def change
    create_table :medio_pagos do |t|
      t.string :nombre

      t.timestamps
    end
  end
end
