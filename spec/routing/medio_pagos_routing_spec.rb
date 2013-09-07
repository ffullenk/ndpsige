require "spec_helper"

describe MedioPagosController do
  describe "routing" do

    it "routes to #index" do
      get("/medio_pagos").should route_to("medio_pagos#index")
    end

    it "routes to #new" do
      get("/medio_pagos/new").should route_to("medio_pagos#new")
    end

    it "routes to #show" do
      get("/medio_pagos/1").should route_to("medio_pagos#show", :id => "1")
    end

    it "routes to #edit" do
      get("/medio_pagos/1/edit").should route_to("medio_pagos#edit", :id => "1")
    end

    it "routes to #create" do
      post("/medio_pagos").should route_to("medio_pagos#create")
    end

    it "routes to #update" do
      put("/medio_pagos/1").should route_to("medio_pagos#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/medio_pagos/1").should route_to("medio_pagos#destroy", :id => "1")
    end

  end
end
