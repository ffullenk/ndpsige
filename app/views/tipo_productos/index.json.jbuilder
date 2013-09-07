json.array!(@tipo_productos) do |tipo_producto|
  json.extract! tipo_producto, :nombre
  json.url tipo_producto_url(tipo_producto, format: :json)
end
