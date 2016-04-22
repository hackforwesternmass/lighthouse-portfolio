class EnrollsController < SessionsController
  before_action :signed_in
  before_action :set_enroll, only: [:update, :destroy]

  def index
    @enrolls = current_user.enrolls
    respond_to do |format|
      format.json { render json: @enrolls }
    end
  end

  def bulk_create
    User.find(params[:user_id]).enrolls.destroy_all
    params[:klass_ids].each do |klass_id|
      Enroll.find_or_create_by(user_id: params[:user_id], klass_id: klass_id)
    end if params[:klass_ids].present?
    render json: {}
  end

  def create
    if Enroll.create(enroll_params)
      render json: {}
    end
  end

  def update
    if @enroll.update(enroll_params)
      render json: {}
    end
  end

  def destroy
    @enroll.destroy
    render json: {}
  end

  private

    def set_enroll
      @enroll = Enroll.find(params[:id])
    end

    def enrol_params
      params.require(:enroll).permit(:user_id, :klass_id, :completed)
    end

end
