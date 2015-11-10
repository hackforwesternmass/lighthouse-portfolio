class User < ActiveRecord::Base
  include BCrypt

  has_many :goals
  has_many :courses
  has_many :resources
  has_many :activities

  has_many :projects, dependent: :destroy
  accepts_nested_attributes_for :projects

  validates :first_name, 
    presence: { message: "First name is required"}

  validates :last_name, 
    presence: { message: "Last name is required"}

  validates :description,
    length: { maximum: 140, message: "140 character max" }

  validates :email, 
    presence: { message: "Email is required." },
    uniqueness: { message: "is already in use." }

  validates :password, 
    presence: { message: "Password is required." },
    confirmation: {message: "Passwords do not match."}

  validates :password_confirmation, 
    presence: { message: "Password confirmation is required." },
    on: :create


  has_attached_file :avatar, :default_url => "default-avatar.png"
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/
 
   def self.authenticate(email, password)
    user = User.find_by_email(email)
    user if user && user.pword == password
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def twitter_handle
    self.twitter.gsub("https://twitter.com/", "").gsub("/", "")
  end

  def tumblr_handle
    self.tumblr.gsub("http://", "").split(".").first.gsub("/", "")
    
  end

  def instagram_handle
    self.instagram.gsub("https://instagram.com/", "").gsub("/", "")
  end
  
  def pword
    @pword ||= Password.new(password)
  end

  def pword=(new_password)
    @pword = Password.create(new_password)
    self.password = @pword
    self.password_confirmation = @pword
  end

end
