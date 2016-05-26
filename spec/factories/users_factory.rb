require 'ffaker'

FactoryGirl.define do
  factory :user do
    email { FFaker::Internet.email }
    password 'password'
    password_confirmation 'password'
    first_name { FFaker::Name.first_name }
    last_name { FFaker::Name.last_name }
    username { "username" }

    factory :admin do
      role 'admin'
    end

    factory :student do
      role 'student'
    end
  end
end
