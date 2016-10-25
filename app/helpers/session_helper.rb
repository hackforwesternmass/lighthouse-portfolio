module SessionHelper

  def current_user
    @current_user ||= User.find(session[:user_id]) if signed_in?
    @current_user ||= User.new
  end

  def active_id
    session[:student_id] || session[:user_id]
  end

  def signed_in?
    session[:user_id].present?
  end

end
