class Portfolio < ActiveRecord::Base
  belongs_to :user

  has_many :social_mediums, through: :user
  accepts_nested_attributes_for :social_mediums, allow_destroy: true

  validates :description,
    length: { maximum: 140, message: "140 character max" }

  has_attached_file :avatar, :default_url => "default-avatar.png"
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  has_attached_file :background, :default_url => "tibetan-mountains.jpg"
  validates_attachment_content_type :background, :content_type => /\Aimage\/.*\Z/

end
