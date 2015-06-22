class Course < ActiveRecord::Base

  has_many :users

  validates :name, 
  	uniqueness: { message: "is already in use." }

  has_attached_file :photo, :default_url => "clearmountains.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

end