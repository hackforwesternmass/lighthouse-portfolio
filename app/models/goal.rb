class Goal < ActiveRecord::Base
  include ISODateMethods

  default_scope { order(is_completed: :asc, created_at: :desc) }

  belongs_to :user
  has_many :action_items, dependent: :destroy
  accepts_nested_attributes_for :action_items, allow_destroy: true

  def due_date_to_iso
    convert_to_iso(due_date)
  end
end
