class UsersController < SessionsController
  before_action :admin_only, only: [:create, :new, :edit]
  before_action :signed_in, except: [:profile, :unfound]

  def index
    @students = User.students
    @highlight_sidebar = "Admin"

    respond_to do |format|
      format.json { render json: @students.to_json(include: :enrolls) }
      format.html
    end
  end

  def profile
    @user = User.find_by(username: params[:username], private: [nil, false])
    if @user
      @projects = @user.projects
      render layout: "public"
    else
      redirect_to unfound_users_path(q: params[:username])
    end
  end

  def search
    students = User.students
    if params[:q].present?
      students =  User.default_search(params[:q]).where(role: "student")
    end
    render json: students.to_json(include: :enrolls)
  end

  def unfound
    @students = User.students
    render layout: "public"
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
    @user = @current_user
    respond_to do |format|
      if @current_user.update(user_params.except(:password, :password_confirmation))
          @current_user.save
        if admin_redirect_direction?
          format.html { redirect_to users_path, flash: { notice: "Profile successfully updated!" } }
        else
          format.html { redirect_to projects_path, flash: { notice: "Profile successfully updated!" } }
        end
          format.json { render json: {} }
      else
        @highlight_sidebar = ( admin_redirect_direction? ? "Admin" : "Portfolio" )
        format.html { admin_redirect_direction? ? render(:edit) : render(:edit_profile) }
        format.json { render json: {}, status: 400 }
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    name = @user.full_name
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, flash: { notice: "#{name} account was successfully deleted." } }
      format.json { head :no_content }
    end
  end

  private
    def admin_redirect_direction?
      request.referrer.split("?").first == edit_user_url(@current_user) || request.referrer.split("?").first == user_url(@current_user)
    end

    def user_params
      @user_params ||= params.require(:user).permit(:first_name, :last_name, :avatar, :meeting_time, :profile_background,
        :role, :email, :password, :password_confirmation, :description, :username, :profile_color, :private,
        social_mediums_attributes: [:link, :name,:_destroy, :id])
    end
end
