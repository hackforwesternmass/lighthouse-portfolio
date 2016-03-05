class User < ActiveRecord::Base
  include BCrypt
  default_scope { order(first_name: :asc) }

  scope :students, -> { where(role: "student" ) }
  has_many :resources, dependent: :destroy
  has_many :meetings, dependent: :destroy
  has_many :goals, dependent: :destroy
  has_many :enrolls, dependent: :destroy
  has_many :klasses, through: :enrolls
  
  has_many :social_mediums, dependent: :destroy
  accepts_nested_attributes_for :social_mediums, allow_destroy: true

  has_many :projects, dependent: :destroy
  accepts_nested_attributes_for :projects

  has_many :tags, through: :projects

  validates :first_name, 
    presence: { message: "First name is required" }

  validates :last_name, 
    presence: { message: "Last name is required" }

  validates :description,
    length: { maximum: 140, message: "140 character max" }

  validates :email, 
    presence: { message: "Email is required." },
    uniqueness: { message: "is already in use." }

  validates :password, 
    presence: { message: "Password is required." },
    confirmation: {message: "Passwords do not match."},
    on: :create

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

  def admin?
    role == "admin"
  end

  def student?
    role == "student"
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