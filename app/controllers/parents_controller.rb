class ParentsController < SessionsController

  def dashboard
    authorize! :access, :parent
    @user = current_user
    render layout: 'public'
  end

  def index
    authorize! :access, :admin
    @parents = User.where(role: 'parent')
    @student_parent_ids = Parent.where(student_id: params[:student_id]).pluck(:user_id)
  end

  def create
    authorize! :access, :admin
    User.find(params[:student_id]).guardians.clear
    Parent.create(params[:student_parent_ids].map { |id| { student_id: params[:student_id], user_id: id } }) if params[:student_parent_ids].present?
    render json: {}, status: 201
  end

end
