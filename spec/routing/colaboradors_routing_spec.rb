require "spec_helper"

describe ColaboradorsController do
  describe "routing" do

    it "routes to #index" do
      get("/colaboradors").should route_to("colaboradors#index")
    end

    it "routes to #new" do
      get("/colaboradors/new").should route_to("colaboradors#new")
    end

    it "routes to #show" do
      get("/colaboradors/1").should route_to("colaboradors#show", :id => "1")
    end

    it "routes to #edit" do
      get("/colaboradors/1/edit").should route_to("colaboradors#edit", :id => "1")
    end

    it "routes to #create" do
      post("/colaboradors").should route_to("colaboradors#create")
    end

    it "routes to #update" do
      put("/colaboradors/1").should route_to("colaboradors#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/colaboradors/1").should route_to("colaboradors#destroy", :id => "1")
    end

  end
end
