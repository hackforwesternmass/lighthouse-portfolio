class Resource < ActiveRecord::Base
	belongs_to :user

  VALID_CATEGORY = ["Online Courses", "Job Sites", "Community"]

  validates :title, 
    presence: { message: "Title is required" }

  validates :link, 
    presence: { message: "Link is required" }

  validates :category, presence: true, inclusion: { in: VALID_CATEGORY,
    message: "%{value} is not a valid category" }

end
