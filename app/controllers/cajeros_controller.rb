class CajerosController < ApplicationController
  before_action :set_cajero, only: [:show, :edit, :update, :destroy]
    before_filter :authenticate_user!
  # GET /cajeros
  # GET /cajeros.json
  def index
    @cajeros = Cajero.all
  end

  # GET /cajeros/1
  # GET /cajeros/1.json
  def show
  end

  # GET /cajeros/new
  def new
    @cajero = Cajero.new
  end

  # GET /cajeros/1/edit
  def edit
  end

  # POST /cajeros
  # POST /cajeros.json
  def create
    @cajero = Cajero.new(cajero_params)

    respond_to do |format|
      if @cajero.save
        format.html { redirect_to @cajero, notice: 'Cajero was successfully created.' }
        format.json { render action: 'show', status: :created, location: @cajero }
      else
        format.html { render action: 'new' }
        format.json { render json: @cajero.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cajeros/1
  # PATCH/PUT /cajeros/1.json
  def update
    respond_to do |format|
      if @cajero.update(cajero_params)
        format.html { redirect_to @cajero, notice: 'Cajero was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @cajero.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cajeros/1
  # DELETE /cajeros/1.json
  def destroy
    @cajero.destroy
    respond_to do |format|
      format.html { redirect_to cajeros_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cajero
      @cajero = Cajero.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cajero_params
      params.require(:cajero).permit(:nombre)
    end
end
