class UserMailer < ApplicationMailer
  def reset_password(user, new_password)
    @user, @new_password = user, new_password
    mail(to: @user.email, subject: "#{ENV['TITLE']} - Reset Password")
  end
end
