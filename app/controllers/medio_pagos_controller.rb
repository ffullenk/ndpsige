class MedioPagosController < ApplicationController
  before_action :set_medio_pago, only: [:show, :edit, :update, :destroy]
    before_filter :authenticate_user!
  # GET /medio_pagos
  # GET /medio_pagos.json
  def index
    @medio_pagos = MedioPago.all
  end

  # GET /medio_pagos/1
  # GET /medio_pagos/1.json
  def show
  end

  # GET /medio_pagos/new
  def new
    @medio_pago = MedioPago.new
  end

  # GET /medio_pagos/1/edit
  def edit
  end

  # POST /medio_pagos
  # POST /medio_pagos.json
  def create
    @medio_pago = MedioPago.new(medio_pago_params)

    respond_to do |format|
      if @medio_pago.save
        format.html { redirect_to @medio_pago, notice: 'Medio pago was successfully created.' }
        format.json { render action: 'show', status: :created, location: @medio_pago }
      else
        format.html { render action: 'new' }
        format.json { render json: @medio_pago.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /medio_pagos/1
  # PATCH/PUT /medio_pagos/1.json
  def update
    respond_to do |format|
      if @medio_pago.update(medio_pago_params)
        format.html { redirect_to @medio_pago, notice: 'Medio pago was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @medio_pago.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /medio_pagos/1
  # DELETE /medio_pagos/1.json
  def destroy
    @medio_pago.destroy
    respond_to do |format|
      format.html { redirect_to medio_pagos_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_medio_pago
      @medio_pago = MedioPago.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def medio_pago_params
      params.require(:medio_pago).permit(:nombre)
    end
end
