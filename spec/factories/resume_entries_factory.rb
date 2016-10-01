FactoryGirl.define do
  factory :resume_entry do
    title { Faker::Name.title }
    subtitle { Faker::Hipster.sentence }
    description { Faker::Hipster.paragraph }
    date { Faker::Date.forward(3) }
    user
  end
end
