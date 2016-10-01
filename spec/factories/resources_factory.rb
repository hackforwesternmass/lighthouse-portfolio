FactoryGirl.define do
  factory :resource do
    title { Faker::Name.title }
    link { Faker::Internet.url }
    category { Faker::Hipster.word }
    description { Faker::Lorem.words }
    general false
    user
  end
end
