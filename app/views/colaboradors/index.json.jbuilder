json.array!(@colaboradors) do |colaborador|
  json.extract! colaborador, :nombre, :telefono, :email, :empresa_id, :user_id
  json.url colaborador_url(colaborador, format: :json)
end
