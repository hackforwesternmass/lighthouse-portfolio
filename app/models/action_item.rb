class ActionItem < ActiveRecord::Base

  # default_scope { order(due_date: :asc) }

  belongs_to :meeting
  belongs_to :goal
  belongs_to :user
  has_one :owner, through: :meeting, source: :user

  def owner_name
    owner.full_name
  end

end
