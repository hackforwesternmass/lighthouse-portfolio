class ResumeEntry < ActiveRecord::Base

  default_scope { order(created_at: :desc) }
  belongs_to :user

  validates :title, presence: { message: 'Title is required' }
  validates :date, presence: { message: 'Date is required' }

end
