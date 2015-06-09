class StaticPagesController < SessionsController
  before_action :current_user

  def home
  	redirect_to user_portfolios_path(@user) if signed_in?
  end

end
