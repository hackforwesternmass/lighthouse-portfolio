require 'rails_helper'
require 'ffaker'

describe User do
  it "is valid with first_name, last_name, username, email and password" do
    user = build(:user)
    expect(user).to be_valid
  end

  it "is invalid with a description greater than 140 characters" do
    user = build(:user, description: FFaker::Lorem.characters(141))
    user.valid?
    expect(user.errors[:description].size).to eq 1
  end

end
