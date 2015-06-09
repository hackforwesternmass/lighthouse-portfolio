class Project < ActiveRecord::Base
	belongs_to :user

  has_attached_file :photo, :default_url => "default-avatar.png"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

end
