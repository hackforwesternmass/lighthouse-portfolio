class SocialMedium < ActiveRecord::Base
  belongs_to :user
  
  validates :name, presence: true
  validates :link, presence: true

  before_save do
    self.icon = find_icon
  end

  def find_icon
    case 
      when self.link.include?("twitter") then "twitter"
      when self.link.include?("facebook") then "facebook"
      when self.link.include?("instagram") then "instagram"
      when self.link.include?("tumblr") then "tumblr"
      when self.link.include?("linkedin") then "linkedin"
      when self.link.include?("soundcloud") then "soundcloud"
      when self.link.include?("github.com") then "github"
      when self.link.include?("reddit") then "reddit"
      when self.link.include?("skype") then "skype"
      when self.link.include?("vine") then "vine"
      when self.link.include?("youtube") then "youtube"
      when self.link.include?("behance") then "behance"
      else ["link", "globe"].sample
    end
  end

end
