class Resource < ActiveRecord::Base
	default_scope { order(id: :asc) }

	belongs_to :user

  validates :title, 
    presence: { message: "Title is required" }

  validates :link,
    presence: { message: "Link is required" }

  validates :description, 
    length: { maximum: 200, too_long: "%{count} characters is the maximum allowed" }

  validates :category,
  	presence: { message: "Category is required" }
    
end
