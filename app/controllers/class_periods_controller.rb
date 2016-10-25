class ClassPeriodsController < SessionsController
  load_and_authorize_resource

  def index
    render json: @class_periods
  end

  def create
    if @class_period.save
      render json: {}, status: 201
    else
      render json: @class_period.errors, status: 400
    end
  end

  def update
    if @class_period.update(class_period_params)
      render json: {}, status: 200
    else
      render json: @class_period.errors, status: 400
    end
  end

  def destroy
    @class_period.destroy
    head :no_content
  end

  private

    def class_period_params
      params.require(:class_period).permit(
        :id,
        :start_time,
        :end_time
      )
    end

end
