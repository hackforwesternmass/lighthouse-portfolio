require 'rails_helper'

describe Portfolio do
  it 'is valid with description, avatar, color and background' do
    portfolio = build(:portfolio)
    expect(portfolio).to be_valid
  end
end
