class UsersController < SessionsController
  skip_before_action :session_expiry, only: [:create]
  before_action :current_user, except: [:create]
  before_action :signed_in, except: [:new, :create]

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
      redirect_to root_path, notice: 'Your account was successfully created.'
    else
      render :new
    end
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :avatar,
        :username, :email, :password, :password_confirmation)
    end
end
