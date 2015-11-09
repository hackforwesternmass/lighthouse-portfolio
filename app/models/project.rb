class Project < ActiveRecord::Base
	belongs_to :user
	has_many :project_attachments, dependent: :destroy
	accepts_nested_attributes_for :project_attachments

  has_attached_file :photo, :default_url => "blue-space-cloud.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

end
