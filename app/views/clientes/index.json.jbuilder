json.array!(@clientes) do |cliente|
  json.extract! cliente, :nombre
  json.url cliente_url(cliente, format: :json)
end
