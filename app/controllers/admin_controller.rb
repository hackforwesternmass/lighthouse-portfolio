class AdminController < SessionsController
  before_action :signed_in
  before_action :admin_only

  def dashboard
  end
  
end
