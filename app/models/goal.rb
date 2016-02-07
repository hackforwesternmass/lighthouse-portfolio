class Goal < ActiveRecord::Base

  default_scope { order(created_at: :desc) }
  # default_scope { order(due_date: :desc) }

  belongs_to :user
  has_many :action_items, dependent: :destroy
  accepts_nested_attributes_for :action_items, allow_destroy: true

end