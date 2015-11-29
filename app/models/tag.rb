class Tag < ActiveRecord::Base
  belongs_to :project

  validates :name,
	  length: { maximum: 30, message: "Tags can be 30 characters max." }
end
