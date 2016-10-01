module SessionHelper

  def current_user
    @current_user ||= User.find(session[:user_id]) if signed_in?
    @current_user ||= User.new
  end

  def admin_only
    if current_user.student?
      return redirect_to user_portfolio_path(current_user),
        flash: { alert: "Admin accounts only, restricted area!" }
    end
  end

  def signed_in?
    session[:user_id].present?
  end

end
