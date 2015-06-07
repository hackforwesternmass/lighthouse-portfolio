class User < ActiveRecord::Base
  include BCrypt

  has_many :projects
  has_many :goals
  has_many :resources

  validates :first_name, 
    presence: { message: "is required."}

  validates :last_name, 
    presence: { message: "is required."}

  validates :username,
    presence: { message: "is required." },
    uniqueness: { message: "s already in use." }   

  validates :email, 
    presence: { message: "is required." },
    uniqueness: { message: "is already in use." }

  validates :password, 
    presence: { message: "is required." },
    confirmation: {message: "do not match."},
    format: {with: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,}/,
    				 message: "is an invalid format."},
					   on: :create

  validates :password_confirmation, 
    presence: { message: "is required." },
    on: :create

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
