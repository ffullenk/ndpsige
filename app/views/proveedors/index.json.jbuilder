json.array!(@proveedors) do |proveedor|
  json.extract! proveedor, :nombre, :telefono, :email, :web
  json.url proveedor_url(proveedor, format: :json)
end
