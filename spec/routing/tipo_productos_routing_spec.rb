require "spec_helper"

describe TipoProductosController do
  describe "routing" do

    it "routes to #index" do
      get("/tipo_productos").should route_to("tipo_productos#index")
    end

    it "routes to #new" do
      get("/tipo_productos/new").should route_to("tipo_productos#new")
    end

    it "routes to #show" do
      get("/tipo_productos/1").should route_to("tipo_productos#show", :id => "1")
    end

    it "routes to #edit" do
      get("/tipo_productos/1/edit").should route_to("tipo_productos#edit", :id => "1")
    end

    it "routes to #create" do
      post("/tipo_productos").should route_to("tipo_productos#create")
    end

    it "routes to #update" do
      put("/tipo_productos/1").should route_to("tipo_productos#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/tipo_productos/1").should route_to("tipo_productos#destroy", :id => "1")
    end

  end
end
