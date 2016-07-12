class ProjectAttachment < ActiveRecord::Base
  belongs_to :project

  has_attached_file :document
  validates_attachment_size :document, less_than: 25.megabytes
  do_not_validate_attachment_file_type :document

  def download_url
    s3 = AWS::S3.new.buckets[ENV['S3_BUCKET_NAME']]
    s3.objects[ self.document.path[1..-1] ].url_for( :read,
      expires_in: 60.minutes,
      use_ssl:    true,
      response_content_disposition: "attachment; filename=\"#{document.original_filename}\"" ).to_s
  end

end
