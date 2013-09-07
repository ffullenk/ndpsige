json.array!(@cajeros) do |cajero|
  json.extract! cajero, :nombre
  json.url cajero_url(cajero, format: :json)
end
