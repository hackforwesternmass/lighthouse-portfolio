class SessionsController < ApplicationController

  before_action :session_expiry, except: [:login_authentication] 
  before_action :update_activity_time
  before_action :current_user, only: [:login]

  def login_authentication

    username_email = params[:user][:username]
    password = params[:user][:password]

    @user = User.authenticate(username_email, password)

    if @user
      session[:user_id] = @user.id
      redirect_to user_portfolio_index_path(user_id: @user.id)
    else
      flash[:alert] = "Something went wrong!"
      redirect_to root_path
    end
    
  end

  def current_user
    @user = User.find(session[:user_id]) if signed_in?
    @user ||= User.new
  end

  def signed_in?
    session[:user_id].present?
  end

  def login
  end
  
  def signed_in
    return redirect_to root_path unless signed_in?
  end
  
  def logout
    disconnect_user
    redirect_to root_path
  end

  def disconnect_user
    session[:user_id] = nil
  end

  def session_expiry
    get_session_time_left
    disconnect_user if @session_time_left <= 0
  end

  def update_activity_time
    session[:expires_at] = 30.minutes.from_now
  end

private

  def get_session_time_left
    expire_time = session[:expires_at] || Time.now
    @session_time_left = (expire_time.to_time - Time.now).to_i
  end

end
