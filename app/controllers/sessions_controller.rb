class SessionsController < ApplicationController
  before_action :session_expiry, except: [:login_authentication]
  before_action :update_activity_time

  def login_authentication
    if user = User.authenticate(params[:username_email], params[:password])
      session[:user_id] = user.id
      redirect_to after_login_path
    else
      redirect_to root_path, alert: "Your email or password were incorrect."
    end
  end

  def access_student
    session[:admin_id] = session[:user_id]
    session[:user_id] = params[:student_id]
    redirect_to action_plan_user_path(session[:user_id])
  end

  def access_admin
    session[:user_id] = session[:admin_id]
    session[:admin_id] = nil
    current_user
    redirect_to admin_dashboard_path
  end

  def login
    @background = BackgroundImage.first
    return redirect_to after_login_path if signed_in?
    render layout: "public"
  end

  def signed_in
    unless signed_in?
      redirect_to root_path
      return
    end
  end

  def logout
    disconnect_user
    redirect_to root_path
  end

private

  def after_login_path
    current_user.admin? ? admin_dashboard_path : user_portfolio_path(current_user)
  end

  def disconnect_user
    session[:user_id] = nil
    session[:admin_id] = nil
  end

  def session_expiry
    get_session_time_left
    disconnect_user if @session_time_left <= 0
  end

  def update_activity_time
    session[:expires_at] = 24.hours.from_now
  end

  def get_session_time_left
    expire_time = session[:expires_at] || Time.now
    @session_time_left = (expire_time.to_time - Time.now).to_i
  end
end
