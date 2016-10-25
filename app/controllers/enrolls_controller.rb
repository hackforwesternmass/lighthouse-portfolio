class EnrollsController < SessionsController

  def bulk_create
    authorize! :access, :admin
    User.find(params[:user_id]).enrolls.destroy_all
    params[:klass_ids].each do |klass_id|
      Enroll.find_or_create_by(user_id: params[:user_id], klass_id: klass_id)
    end if params[:klass_ids].present?
    render json: {}
  end

end
