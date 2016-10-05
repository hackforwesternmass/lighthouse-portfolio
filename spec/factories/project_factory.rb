FactoryGirl.define do
  factory :project do
    title { Faker::Lorem.word }
    description { Faker::Lorem.words }
    date_completed { Faker::Date.forward(3) }
    body { Faker::Hipster.paragraph }
    location { Faker::Address.street_address }
    priority false
    user
  end
end
