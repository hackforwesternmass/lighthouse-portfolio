class AdminController < SessionsController

  def dashboard
    @user = current_user
  end

end
