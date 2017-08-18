class ActionItem < ActiveRecord::Base
  include ISODateMethods
  default_scope { order(created_at: :desc) }

  belongs_to :meeting
  belongs_to :goal
  belongs_to :user # Advisor
  has_one :meeting_owner, through: :meeting, source: :user # Student
  has_one :goal_owner, through: :goal, source: :user # Student

  validate :archived_user

  def owner
    meeting_owner || goal_owner
  end

  def archived_user
    if owner.archive
      errors.add(:user_archived, 'Cannot create action items for archived users')
    end
  end

  def owner_name
    owner.full_name
  end

  def due_date_to_iso
    convert_to_iso(due_date)
  end
end
