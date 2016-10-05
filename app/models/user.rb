class User < ActiveRecord::Base
  include BCrypt
  include PgSearch
  pg_search_scope :default_search, :against => [:first_name, :last_name, :username], :using => {:tsearch => {:prefix => true} }
  default_scope { order(first_name: :asc) }

  scope :students, -> { where(role: 'student' ) }
  has_one :portfolio, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :meetings, dependent: :destroy
  has_many :goals, dependent: :destroy
  has_many :enrolls, dependent: :destroy
  has_many :klasses, through: :enrolls
  has_many :action_items, -> { where(user_id: [nil, '']) }, through: :meetings
  has_many :social_mediums, dependent: :destroy
  has_many :admin_action_items, foreign_key: 'user_id', class_name: 'ActionItem'
  has_many :resume_entries, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :tags, through: :projects
  has_many :children, class_name: 'Parent'
  has_many :students, through: :children
  has_many :guardians, foreign_key: 'student_id', class_name: 'Parent'
  has_many :parents, through: :guardians, source: :user
  after_create :create_portfolio

  validates :first_name,
    presence: { message: 'First name is required' }

  validates :last_name,
    presence: { message: 'Last name is required' }

  validates :username,
    presence: { message: 'Username is required' },
    uniqueness: { message: 'is already in use.' },
    format: { with: /\A[\w]+\z/, message: 'Letters and numbers only' }

  validates :email,
    presence: { message: 'Email is required.' },
    uniqueness: { message: 'is already in use.' }

  validates :password,
    presence: { message: 'Password is required.', on: :create },
    confirmation: {message: 'Passwords do not match.'}

  validates :role,
    presence: { message: 'Role is required.' }


  has_attached_file :avatar, :default_url => 'default-avatar.png'
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  has_attached_file :profile_background, :default_url => 'tibetan-mountains.jpg'
  validates_attachment_content_type :profile_background, :content_type => /\Aimage\/.*\Z/

  def self.authenticate(username_email, password)
    user = User.username_or_email(username_email)
    return user if user && user.pword == password
  end

  def self.username_or_email(username_email)
    a = self.arel_table
    user = self.where(a[:username].eq(username_email).or(a[:email].eq(username_email))).first
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def admin?
    role == 'admin'
  end

  def parent?
    role == 'parent'
  end

  def student?
    role == 'student'
  end

  def pword
    @pword ||= Password.new(password)
  end

  def pword=(new_password)
    @pword = Password.create(new_password)
    self.password = @pword
    self.password_confirmation = @pword
  end

  before_create do
    if valid?
      @pword = Password.create(password)
      self.password = @pword
      self.password_confirmation = @pword
    end
  end

end
