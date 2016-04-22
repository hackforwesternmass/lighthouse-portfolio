class UsersController < SessionsController
  before_action :admin_only, only: [:create, :new, :edit]

  def index
    @students = User.students
    @highlight_sidebar = "Admin"

    respond_to do |format|
      format.json { render json: @students.to_json(include: :enrolls) }
      format.html 
    end

  end

  def search
    students = User.students

    if params[:q].present?
      students =  User.default_search(params[:q]).where(role: "student")
    end

    render json: students.to_json(include: :enrolls)
  end

  def show
  end

  def new
    @user = User.new
    @highlight_sidebar = "Admin"
  end

  def edit
    @user = User.find params[:id]
    @highlight_sidebar = "Admin"
  end

  def edit_profile
    @highlight_sidebar = "Portfolio"
  end

  def create
    @user = User.new(user_params)
    @user.pword = params[:user][:password] if @user.valid?

    if @user.save
      if @user.admin?
        redirect_to admin_dashboard_path, notice: 'Admin account successfully created.'
      else
        redirect_to admin_dashboard_path, notice: 'Student account successfully created.'
      end
    else
      render 'new'
    end
  end

  def update
    @current_user = User.find(params[:id])

    prefix = ['Darn! ', 'Dang! ', 'Oh Snap! '].sample

    respond_to do |format|
      if @current_user.update(user_params)
          @current_user.pword = params[:user][:password] unless params[:user][:password].blank?
          @current_user.save
        if (request.referrer.split("?").first == edit_user_url(@current_user))
          format.html { redirect_to users_path, flash: { notice: "Profile successfully updated!" } }
        else
          format.html { redirect_to projects_path, flash: { notice: "Profile successfully updated!" } }
        end
          format.json { render json: {} }
      else
        flash.now[:alert] = prefix << "Change a few things up and try submitting again."
        format.html { if (request.referrer.split("?").first == edit_user_url(@user)) then render(:edit) else render(:edit_profile) end }
        format.json { render json: {}, status: 400 }
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, flash: { notice: 'User was successfully deleted.' } }
      format.json { head :no_content }
    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :avatar, :meeting_time, :profile_background,
        :role, :email, :password, :password_confirmation, :description, :username,
        social_mediums_attributes: [:link, :name,:_destroy, :id])
    end
end
