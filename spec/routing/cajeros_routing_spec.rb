require "spec_helper"

describe CajerosController do
  describe "routing" do

    it "routes to #index" do
      get("/cajeros").should route_to("cajeros#index")
    end

    it "routes to #new" do
      get("/cajeros/new").should route_to("cajeros#new")
    end

    it "routes to #show" do
      get("/cajeros/1").should route_to("cajeros#show", :id => "1")
    end

    it "routes to #edit" do
      get("/cajeros/1/edit").should route_to("cajeros#edit", :id => "1")
    end

    it "routes to #create" do
      post("/cajeros").should route_to("cajeros#create")
    end

    it "routes to #update" do
      put("/cajeros/1").should route_to("cajeros#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/cajeros/1").should route_to("cajeros#destroy", :id => "1")
    end

  end
end
