FactoryGirl.define do
  factory :portfolio do
    description { Faker::Lorem.words }
    color "#00FF00"
    private false
    background {Faker::Avatar.image}
    avatar {Faker::Avatar.image}
    user
  end
end
