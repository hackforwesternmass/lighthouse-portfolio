class ApplicationMailer < ActionMailer::Base
  default from: "#{ENV['TITLE']} <no-reply@#{ENV['DOMAIN']}>"
  layout 'mailer'

  protected
    def build_recipient_email(email)
      if Rails.env.production?
        email
      else
        "#{email}.test_email.com"
      end
    end
end
