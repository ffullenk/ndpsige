json.array!(@stocks) do |stock|
  json.extract! stock, :articulo_id, :cantidad, :precio_unitario, :precio_total, :user_id, :empresa_id, :fecha_compra
  json.url stock_url(stock, format: :json)
end
