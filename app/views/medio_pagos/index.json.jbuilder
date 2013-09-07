json.array!(@medio_pagos) do |medio_pago|
  json.extract! medio_pago, :nombre
  json.url medio_pago_url(medio_pago, format: :json)
end
