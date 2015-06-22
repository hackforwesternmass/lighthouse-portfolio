class Action < ActiveRecord::Base
  belongs_to :goal

  has_many :action_items
end
