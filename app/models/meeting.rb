class Meeting < ActiveRecord::Base
  default_scope { order(created_at: :desc) }

  belongs_to :user
  has_many :action_items, dependent: :destroy
  accepts_nested_attributes_for :action_items, allow_destroy: true
  validate :archived_user

  def archived_user
    if user.archive
      errors.add(:user_archived, 'Cannot create meetings for archived users')
    end
  end
end
