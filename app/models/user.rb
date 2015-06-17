class User < ActiveRecord::Base
  include BCrypt

  has_many :goals
  has_many :courses
  has_many :resources
  has_many :activities

  has_many :projects, dependent: :destroy
  accepts_nested_attributes_for :projects

  validates :first_name, 
    presence: { message: "is required."}

  validates :last_name, 
    presence: { message: "is required."}

  validates :description,
    length: { maximum: 140 }

  validates :email, 
    presence: { message: "is required." },
    uniqueness: { message: "is already in use." }

  validates :password, 
    presence: { message: "is required." },
    confirmation: {message: "do not match."}

  validates :password_confirmation, 
    presence: { message: "is required." },
    on: :create


  has_attached_file :avatar, :default_url => "default-avatar.png"
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/
  
  def self.authenticate(username_email, password)
    a = self.arel_table
    user = self.where(a[:username].eq(username_email)
      .or(a[:email].eq(username_email))).first
    user if user && user.pword == password
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
