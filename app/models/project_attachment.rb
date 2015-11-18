class ProjectAttachment < ActiveRecord::Base
  belongs_to :project

  has_attached_file :document, :styles => { :pdf_thumbnail => ["100x100", :png] }
  validates_attachment :document, content_type: { content_type: "application/pdf" }
end
