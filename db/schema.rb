# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20130906234404) do

  create_table "articulos", force: true do |t|
    t.string   "nombre"
    t.float    "precio"
    t.integer  "empresa_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "articulos", ["empresa_id"], name: "index_articulos_on_empresa_id", using: :btree

  create_table "cajeros", force: true do |t|
    t.string   "nombre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clientes", force: true do |t|
    t.string   "nombre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "colaboradors", force: true do |t|
    t.string   "nombre"
    t.string   "telefono"
    t.string   "email"
    t.integer  "empresa_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "colaboradors", ["empresa_id"], name: "index_colaboradors_on_empresa_id", using: :btree
  add_index "colaboradors", ["user_id"], name: "index_colaboradors_on_user_id", using: :btree

  create_table "empresas", force: true do |t|
    t.string   "nombre"
    t.string   "ciudad"
    t.string   "email"
    t.string   "telefono"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "medio_pagos", force: true do |t|
    t.string   "nombre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "productos", force: true do |t|
    t.string   "nombre"
    t.integer  "tipoProducto_id"
    t.integer  "stock"
    t.float    "precio"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "productos", ["tipoProducto_id"], name: "index_productos_on_tipoProducto_id", using: :btree

  create_table "productosales", force: true do |t|
    t.integer  "producto_id"
    t.integer  "sale_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "cantidad"
  end

  add_index "productosales", ["producto_id"], name: "index_productosales_on_producto_id", using: :btree
  add_index "productosales", ["sale_id"], name: "index_productosales_on_sale_id", using: :btree

  create_table "sales", force: true do |t|
    t.integer  "cajero_id"
    t.integer  "cliente_id"
    t.integer  "medioPago_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "fecha"
    t.boolean  "anulado"
    t.boolean  "telefonico"
  end

  add_index "sales", ["cajero_id"], name: "index_sales_on_cajero_id", using: :btree
  add_index "sales", ["cliente_id"], name: "index_sales_on_cliente_id", using: :btree
  add_index "sales", ["medioPago_id"], name: "index_sales_on_medioPago_id", using: :btree
  add_index "sales", ["user_id"], name: "index_sales_on_user_id", using: :btree

  create_table "stocks", force: true do |t|
    t.integer  "articulo_id"
    t.float    "cantidad"
    t.float    "precio_unitario"
    t.float    "precio_total"
    t.integer  "user_id"
    t.integer  "empresa_id"
    t.date     "fecha_compra"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "stocks", ["articulo_id"], name: "index_stocks_on_articulo_id", using: :btree
  add_index "stocks", ["empresa_id"], name: "index_stocks_on_empresa_id", using: :btree
  add_index "stocks", ["user_id"], name: "index_stocks_on_user_id", using: :btree

  create_table "tipo_productos", force: true do |t|
    t.string   "nombre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "nombre"
    t.integer  "empresa_id"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["empresa_id"], name: "index_users_on_empresa_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "venta_productos", force: true do |t|
    t.integer  "venta_id"
    t.integer  "producto_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venta_productos", ["producto_id"], name: "index_venta_productos_on_producto_id", using: :btree
  add_index "venta_productos", ["venta_id"], name: "index_venta_productos_on_venta_id", using: :btree

  create_table "ventas", force: true do |t|
    t.date     "fecha"
    t.integer  "cajero_id"
    t.integer  "cliente_id"
    t.boolean  "anulado"
    t.boolean  "telefonico"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "boleta"
    t.string   "nombrecliente"
    t.integer  "medio_pago_id"
    t.float    "total"
  end

  add_index "ventas", ["cajero_id"], name: "index_ventas_on_cajero_id", using: :btree
  add_index "ventas", ["cliente_id"], name: "index_ventas_on_cliente_id", using: :btree
  add_index "ventas", ["medio_pago_id"], name: "index_ventas_on_medio_pago_id", using: :btree

end
