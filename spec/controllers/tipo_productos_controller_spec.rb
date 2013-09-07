require 'spec_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

describe TipoProductosController do

  # This should return the minimal set of attributes required to create a valid
  # TipoProducto. As you add validations to TipoProducto, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) { { "nombre" => "MyString" } }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # TipoProductosController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET index" do
    it "assigns all tipo_productos as @tipo_productos" do
      tipo_producto = TipoProducto.create! valid_attributes
      get :index, {}, valid_session
      assigns(:tipo_productos).should eq([tipo_producto])
    end
  end

  describe "GET show" do
    it "assigns the requested tipo_producto as @tipo_producto" do
      tipo_producto = TipoProducto.create! valid_attributes
      get :show, {:id => tipo_producto.to_param}, valid_session
      assigns(:tipo_producto).should eq(tipo_producto)
    end
  end

  describe "GET new" do
    it "assigns a new tipo_producto as @tipo_producto" do
      get :new, {}, valid_session
      assigns(:tipo_producto).should be_a_new(TipoProducto)
    end
  end

  describe "GET edit" do
    it "assigns the requested tipo_producto as @tipo_producto" do
      tipo_producto = TipoProducto.create! valid_attributes
      get :edit, {:id => tipo_producto.to_param}, valid_session
      assigns(:tipo_producto).should eq(tipo_producto)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates a new TipoProducto" do
        expect {
          post :create, {:tipo_producto => valid_attributes}, valid_session
        }.to change(TipoProducto, :count).by(1)
      end

      it "assigns a newly created tipo_producto as @tipo_producto" do
        post :create, {:tipo_producto => valid_attributes}, valid_session
        assigns(:tipo_producto).should be_a(TipoProducto)
        assigns(:tipo_producto).should be_persisted
      end

      it "redirects to the created tipo_producto" do
        post :create, {:tipo_producto => valid_attributes}, valid_session
        response.should redirect_to(TipoProducto.last)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved tipo_producto as @tipo_producto" do
        # Trigger the behavior that occurs when invalid params are submitted
        TipoProducto.any_instance.stub(:save).and_return(false)
        post :create, {:tipo_producto => { "nombre" => "invalid value" }}, valid_session
        assigns(:tipo_producto).should be_a_new(TipoProducto)
      end

      it "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        TipoProducto.any_instance.stub(:save).and_return(false)
        post :create, {:tipo_producto => { "nombre" => "invalid value" }}, valid_session
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      it "updates the requested tipo_producto" do
        tipo_producto = TipoProducto.create! valid_attributes
        # Assuming there are no other tipo_productos in the database, this
        # specifies that the TipoProducto created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        TipoProducto.any_instance.should_receive(:update).with({ "nombre" => "MyString" })
        put :update, {:id => tipo_producto.to_param, :tipo_producto => { "nombre" => "MyString" }}, valid_session
      end

      it "assigns the requested tipo_producto as @tipo_producto" do
        tipo_producto = TipoProducto.create! valid_attributes
        put :update, {:id => tipo_producto.to_param, :tipo_producto => valid_attributes}, valid_session
        assigns(:tipo_producto).should eq(tipo_producto)
      end

      it "redirects to the tipo_producto" do
        tipo_producto = TipoProducto.create! valid_attributes
        put :update, {:id => tipo_producto.to_param, :tipo_producto => valid_attributes}, valid_session
        response.should redirect_to(tipo_producto)
      end
    end

    describe "with invalid params" do
      it "assigns the tipo_producto as @tipo_producto" do
        tipo_producto = TipoProducto.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        TipoProducto.any_instance.stub(:save).and_return(false)
        put :update, {:id => tipo_producto.to_param, :tipo_producto => { "nombre" => "invalid value" }}, valid_session
        assigns(:tipo_producto).should eq(tipo_producto)
      end

      it "re-renders the 'edit' template" do
        tipo_producto = TipoProducto.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        TipoProducto.any_instance.stub(:save).and_return(false)
        put :update, {:id => tipo_producto.to_param, :tipo_producto => { "nombre" => "invalid value" }}, valid_session
        response.should render_template("edit")
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested tipo_producto" do
      tipo_producto = TipoProducto.create! valid_attributes
      expect {
        delete :destroy, {:id => tipo_producto.to_param}, valid_session
      }.to change(TipoProducto, :count).by(-1)
    end

    it "redirects to the tipo_productos list" do
      tipo_producto = TipoProducto.create! valid_attributes
      delete :destroy, {:id => tipo_producto.to_param}, valid_session
      response.should redirect_to(tipo_productos_url)
    end
  end

end
