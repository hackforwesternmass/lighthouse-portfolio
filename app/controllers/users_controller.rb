class UsersController < SessionsController

  def index
    @users = User.all
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
  end

  def create
    @user = User.new(user_params)
    @user.role = "Student"
    @user.pword = params[:user][:password] if @user.valid?

    if @user.save
      session[:user_id] = @user.id
      redirect_to user_projects_path(@user), notice: 'Your account was successfully created.'
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
        :username, :email, :password, :password_confirmation, :description, 
        social_mediums_attributes: [:link, :name,:_destroy, :id])
    end
end
