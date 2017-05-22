class UserMailer < ApplicationMailer
  def reset_password(user, new_password)
    @user, @new_password = user, new_password
    mail(to: build_recipient_email(user.email), subject: "#{ENV['TITLE']} - Reset Password")
  end
end
