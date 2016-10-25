require 'rails_helper'

describe User do
  it 'is valid with first_name, last_name, username, email and password' do
    user = build(:user)
    expect(user).to be_valid
  end

  it 'is invalid without a first_name' do
    user = build(:user, first_name: nil)
    user.valid?
    expect(user.errors[:first_name].size).to eq 1
  end

  it 'is invalid without a last_name' do
    user = build(:user, last_name: nil)
    user.valid?
    expect(user.errors[:last_name].size).to eq 1
  end

  it 'is invalid without a email' do
    user = build(:user, email: nil)
    user.valid?
    expect(user.errors[:email].size).to eq 1
  end
end
