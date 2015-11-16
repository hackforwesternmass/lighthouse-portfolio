class UsersController < SessionsController
  skip_before_action :session_expiry, only: [:create]
  before_action :current_user, except: [:create]
  before_action :signed_in, except: [:new, :create]

  layout "student", only: [:edit, :update]

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
      redirect_to user_portfolios_path(@user), notice: 'Your account was successfully created.'
    else
      render 'new'
    end
  end

  def update

    prefix = ['Darn! ', 'Dang! ', 'Oh Snap! '].sample

    if @user.update(user_params)
      redirect_to user_portfolios_path(user_id: @user.id), flash: { notice: "Profile successfully updated!" }
    else
      word = @user.errors.count.eql?(1) ? "one" : "a few"
      flash.now[:alert] = prefix << "Change #{word} things up and try submitting again."
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

  def add_courses
    @user.courses.delete_all

    params['courses'].each do |c|
      @user.courses << Course.find(c.first)
    end

    redirect_to user_goals_path(user_id: params[:id])
  end


  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :avatar, :tumblr, :twitter, :instagram,
        :username, :email, :password, :password_confirmation, :description)
    end
end
