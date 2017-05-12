class ApplicationSetting < ActiveRecord::Base

  has_attached_file :home_background_image, :default_url => 'books-alot-of-books-dark.jpg'
  validates_attachment_content_type :home_background_image, :content_type => /\Aimage\/.*\Z/

  def home_background_image_url
    home_background_image.url
  end

end
