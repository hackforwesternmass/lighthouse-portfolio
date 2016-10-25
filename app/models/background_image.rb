class BackgroundImage < ActiveRecord::Base

  has_attached_file :image, :default_url => 'books-alot-of-books-dark.jpg'
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

end
