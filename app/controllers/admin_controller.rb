class AdminController < SessionsController

  def dashboard
    authorize! :access, :admin
    @user = current_user
  end
  
end
