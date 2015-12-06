class Project < ActiveRecord::Base
	default_scope { order(priority: :desc, date_completed: :desc) }

  belongs_to :user
	has_many :project_attachments, dependent: :destroy
	accepts_nested_attributes_for :project_attachments, allow_destroy: true

  has_many :tags, dependent: :destroy
  accepts_nested_attributes_for :tags, allow_destroy: true

  has_attached_file :photo, :default_url => "blue-space-cloud.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

  validates :title, 
    presence: { message: "Title is required" }

  validates :description,
    length: { maximum: 200, message: "200 character max" }

  def next
    ids = Project.where(user_id: self.user_id).pluck :id
    pos = ids.index(self.id)
    next_pos = ids[ (pos + 1) % ids.length ]
    Project.find next_pos
  end

  def previous
    ids = Project.where(user_id: self.user_id).pluck :id
    pos = ids.index(self.id)
    prev_pos = ids[ (pos - 1) % ids.length ]
    Project.find prev_pos
  end

  before_save do
    self.date_completed = created_at if date_completed.blank?
  end


end
