json.array!(@productos) do |producto|
  json.extract! producto, :nombre, :tipoProducto_id, :stock, :precio
  json.url producto_url(producto, format: :json)
end
