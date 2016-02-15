class UsersController < SessionsController
  before_action :admin_only, only: [:create, :new, :edit, :update]

  def index
    @users = User.all
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
    @user = User.find params[:id]
  end

  def edit_profile
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

    prefix = ['Darn! ', 'Dang! ', 'Oh Snap! '].sample

    if current_user.update(user_params)
      redirect_to user_projects_path(user_id: @user.id), flash: { notice: "Profile successfully updated!" }
    else
      flash.now[:alert] = prefix << "Change a few things up and try submitting again."
      render :edit
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, flash: { notice: 'User was successfully destroyed.' } }
      format.json { head :no_content }
    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :avatar,
        :role, :email, :password, :password_confirmation, :description, 
        social_mediums_attributes: [:link, :name,:_destroy, :id])
    end
end
