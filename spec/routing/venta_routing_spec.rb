require "spec_helper"

describe VentaController do
  describe "routing" do

    it "routes to #index" do
      get("/venta").should route_to("venta#index")
    end

    it "routes to #new" do
      get("/venta/new").should route_to("venta#new")
    end

    it "routes to #show" do
      get("/venta/1").should route_to("venta#show", :id => "1")
    end

    it "routes to #edit" do
      get("/venta/1/edit").should route_to("venta#edit", :id => "1")
    end

    it "routes to #create" do
      post("/venta").should route_to("venta#create")
    end

    it "routes to #update" do
      put("/venta/1").should route_to("venta#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/venta/1").should route_to("venta#destroy", :id => "1")
    end

  end
end
