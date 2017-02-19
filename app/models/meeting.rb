class Meeting < ActiveRecord::Base
  default_scope { order(created_at: :desc) }

  belongs_to :user
  has_many :action_items, dependent: :destroy
  accepts_nested_attributes_for :action_items, allow_destroy: true

  validates :notes, presence: { message: 'Notes is required.' }
end
