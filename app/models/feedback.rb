class Feedback < ActiveRecord::Base
  belongs_to :user
  validates :name, presence: { message: 'Teacher name is required' }
  validates :subject, presence: { message: 'Subject is required' }
  validates :text, presence: { message: 'Feedback is required' }
  validate :archived_user

  def archived_user
    if user.archive
      errors.add(:user_archived, 'Cannot create feedback for archived users')
    end
  end
end
