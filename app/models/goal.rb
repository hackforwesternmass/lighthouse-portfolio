class Goal < ActiveRecord::Base

  default_scope { order(is_completed: :asc, created_at: :desc) }

  belongs_to :user
  has_many :action_items, dependent: :destroy
  accepts_nested_attributes_for :action_items, allow_destroy: true

end
