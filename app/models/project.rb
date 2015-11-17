class Project < ActiveRecord::Base
	belongs_to :user
	has_many :project_attachments, dependent: :destroy
	accepts_nested_attributes_for :project_attachments

  has_attached_file :photo, :default_url => "blue-space-cloud.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

 scope :prioritize, -> { order(priority: :desc, created_at: :desc) } 

  def next
  	nex = Project.prioritize.where('id > ?', self.id).first
  	if nex.nil? then Project.first else nex end
  end

  def previous
  	prev = Project.prioritize.where('id < ?', self.id).last
  	if prev.nil? then Project.last else prev end
  end

end
