require 'faker'

FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password 'password'
    password_confirmation 'password'
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    username { Faker::Lorem.characters(10) }
    role 'student'

    factory :admin do
      role 'admin'
    end

    factory :student do
      role 'student'
    end

    factory :parent do
      role 'parent'
    end
  end
end
