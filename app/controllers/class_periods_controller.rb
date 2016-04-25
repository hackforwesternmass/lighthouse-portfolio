class ClassPeriodsController < SessionsController
  before_action :signed_in

  def index
    @class_periods = ClassPeriod.all
    render json: @class_periods
  end

  def create
    class_period = ClassPeriod.new(class_period_params)
    if class_period.save
      render json: {}, status: 200
    else
      render json: class_period.errors, status: 400
    end
  end

  def update
    class_period = ClassPeriod.find params[:id]
    if class_period.update(class_period_params)
      render json: {}, status: 200
    else
      render json: class_period.errors, status: 400
    end
  end

  def destroy
    ClassPeriod.find(params[:id]).destroy
    render json: {}, status: 200
  end

  private
    def class_period_params
      params.require(:class_period).permit(:id, :start_time, :end_time)
    end 
end
