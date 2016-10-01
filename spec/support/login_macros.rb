module LoginMacros
  def sign_in(user)
    session[:user_id] = user.id
    session[:expires_at] = 6.hours.from_now
  end
end
