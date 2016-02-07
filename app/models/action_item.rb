class ActionItem < ActiveRecord::Base

  default_scope { order(id: :asc) }

  belongs_to :meeting
  belongs_to :goal

end
