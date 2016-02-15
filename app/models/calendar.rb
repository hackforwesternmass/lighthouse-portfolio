class Calendar < ActiveRecord::Base

  validates :calendar_id, presence: { message: "Calendar id is required"}

end
