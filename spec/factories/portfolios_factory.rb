FactoryGirl.define do
  factory :portfolio do
    description { Faker::Lorem.words }
    color "#00FF00"
    private false
    user
  end
end
