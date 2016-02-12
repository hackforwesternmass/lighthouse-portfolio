class ProjectAttachment < ActiveRecord::Base
  belongs_to :project

  has_attached_file :document
  do_not_validate_attachment_file_type :document

  def download_url
    s3 = AWS::S3.new.buckets[ 'compassteens' ]
    s3.objects[ self.document.path[1..-1] ].url_for( :read,
      expires_in: 60.minutes, 
      use_ssl:    true, 
      response_content_disposition: "attachment; filename=\"#{document.original_filename}\"" ).to_s
  end

end
