require 'rails_helper'

describe ResumeEntry do
  it 'is valid with title and date' do
    resume_entry = build(:resume_entry)
    expect(resume_entry).to be_valid
  end

  it 'is invalid without a title' do
    resume_entry = build(:resume_entry, title: nil)
    resume_entry.valid?
    expect(resume_entry.errors[:title].size).to eq 1
  end

  it 'is invalid without a date' do
    resume_entry = build(:resume_entry, date: nil)
    resume_entry.valid?
    expect(resume_entry.errors[:date].size).to eq 1
  end
end
