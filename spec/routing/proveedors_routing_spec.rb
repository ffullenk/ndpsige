require "spec_helper"

describe ProveedorsController do
  describe "routing" do

    it "routes to #index" do
      get("/proveedors").should route_to("proveedors#index")
    end

    it "routes to #new" do
      get("/proveedors/new").should route_to("proveedors#new")
    end

    it "routes to #show" do
      get("/proveedors/1").should route_to("proveedors#show", :id => "1")
    end

    it "routes to #edit" do
      get("/proveedors/1/edit").should route_to("proveedors#edit", :id => "1")
    end

    it "routes to #create" do
      post("/proveedors").should route_to("proveedors#create")
    end

    it "routes to #update" do
      put("/proveedors/1").should route_to("proveedors#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/proveedors/1").should route_to("proveedors#destroy", :id => "1")
    end

  end
end
