class Project < ActiveRecord::Base
	default_scope { order(priority: :desc, date_completed: :desc) }

  belongs_to :user
	has_many :project_attachments, dependent: :destroy
	accepts_nested_attributes_for :project_attachments, allow_destroy: true

  has_many :tags, dependent: :destroy
  accepts_nested_attributes_for :tags, allow_destroy: true

  #what's the default url for?
  has_attached_file :photo, :default_url => "blue-space-cloud.jpg"
  validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

  has_attached_file :document
  validates_attachment_size :document, less_than: 25.megabytes
  do_not_validate_attachment_file_type :document

  validates :title,
    presence: { message: "Title is required" }

  validates :description,
    length: { maximum: 200, too_long: "%{count} characters is the maximum allowed" }

  def download_url
    s3 = AWS::S3.new.buckets[ENV['S3_BUCKET_NAME']]
    s3.objects[ self.document.path[1..-1] ].url_for( :read,
      expires_in: 60.minutes,
      use_ssl:    true,
      response_content_disposition: "attachment; filename=\"#{document.original_filename}\"" ).to_s
  end

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
