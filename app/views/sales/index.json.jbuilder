json.array!(@sales) do |sale|
  json.extract! sale, :cajero_id, :cliente_id, :medioPago_id, :user_id
  json.url sale_url(sale, format: :json)
end
