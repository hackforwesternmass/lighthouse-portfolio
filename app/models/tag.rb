class Tag < ActiveRecord::Base
  belongs_to :project
  has_one :user, through: :project

  validates :name,
	  length: { maximum: 30, message: "Tags may only be a 30 maximum of characters" }
end
