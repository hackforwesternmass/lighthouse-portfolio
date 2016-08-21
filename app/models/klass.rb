class Klass < ActiveRecord::Base
  include PgSearch
  pg_search_scope :default_search, :against => [:name, :description, :instructor, :weekday, :time, :year, :season], :using => {:tsearch => {:prefix => true}}
  default_scope { order(created_at: :desc) }

  VALID_WEEKDAYS_TYPES = ["Monday", "Monday/Wednesday", "Tuesday", "Tuesday/Thursday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  VALID_SEASON_TYPES = ["Block 1", "Block 2", "Block 3", "Block 4", "Block 5"]

  has_many :enrolls, dependent: :destroy
  has_many :users, through: :enrolls

  validates :name,
    presence: { message: "Title is required" }

  def enrolled
    self.enrolls.count
  end
end
