class Feedback < ActiveRecord::Base
  validates :name, presence: { message: 'Teacher name is required' }
  validates :subject, presence: { message: 'Subject is required' }
  validates :text, presence: { message: 'Feedback is required' }
end
