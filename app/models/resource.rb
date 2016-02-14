class Resource < ActiveRecord::Base
	default_scope { order(id: :asc) }

	belongs_to :user

  validates :title, 
    presence: { message: "Title is required" }

  validates :link, 
    presence: { message: "Link is required" }

  validates :category,
  	presence: { message: "Category is required" }
    
end
