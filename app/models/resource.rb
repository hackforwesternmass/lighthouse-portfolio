class Resource < ActiveRecord::Base
	belongs_to :user

  validates :title, 
    presence: { message: "Title is required" }

  validates :link, 
    presence: { message: "Link is required" }

  validates :category,
  	presence: { message: "Category is required" }

end
