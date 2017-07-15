class Portfolio < ActiveRecord::Base

  belongs_to :user
  has_many :social_mediums, foreign_key: 'user_id'
  accepts_nested_attributes_for :social_mediums, allow_destroy: true

  validates :description, length: { maximum: 140, message: '140 character max' }

  has_attached_file :avatar,
                    default_url: ActionController::Base.helpers.asset_url('changed.png'),
                    styles: { thumb: "100x100#", medium: '250x250#' }
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  has_attached_file :background,
                    default_url: ActionController::Base.helpers.asset_path('tibetan-mountains.jpg')
  validates_attachment_content_type :background, :content_type => /\Aimage\/.*\Z/

  def thumb_avatar_url
    avatar.url(:thumb)
  end
end
