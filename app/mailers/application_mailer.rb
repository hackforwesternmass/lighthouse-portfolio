class ApplicationMailer < ActionMailer::Base
  default from: "#{ENV['TITLE']} <#{ENV['SMTP_USERNAME']}>"
  layout 'mailer'
end
