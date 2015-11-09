class ProjectAttachment < ActiveRecord::Base
  belongs_to :project

  has_attached_file :document, styles: {thumbnail: "60x60"}
  validates_attachment :document, content_type: { content_type: "application/pdf" }
end
