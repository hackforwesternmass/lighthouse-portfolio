class ApplicationMailer < ActionMailer::Base
  default from: "#{ENV['TITLE']} <no-reply@#{ENV['DOMAIN']}>"
  layout 'mailer'
end
