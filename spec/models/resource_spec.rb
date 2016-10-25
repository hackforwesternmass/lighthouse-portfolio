require 'rails_helper'

describe Resource do
  it 'is valid with title, link and category' do
    resource = build(:resource)
    expect(resource).to be_valid
  end

  it 'is invalid without a title' do
    resource = build(:resource, title: nil)
    resource.valid?
    expect(resource.errors[:title].size).to eq 1
  end

  it 'is invalid without a link' do
    resource = build(:resource, link: nil)
    resource.valid?
    expect(resource.errors[:link].size).to eq 1
  end

  it 'is invalid without a category' do
    resource = build(:resource, category: nil)
    resource.valid?
    expect(resource.errors[:category].size).to eq 1
  end

  it 'is invalid with a description over 200 characters' do
    resource = build(:resource, description: Faker::Lorem.characters(201))
    resource.valid?
    expect(resource.errors[:description].size).to eq 1
  end
end
