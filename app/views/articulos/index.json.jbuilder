json.array!(@articulos) do |articulo|
  json.extract! articulo, :nombre, :precio, :empresa_id
  json.url articulo_url(articulo, format: :json)
end
