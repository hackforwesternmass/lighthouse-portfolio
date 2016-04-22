class Klass < ActiveRecord::Base
  include PgSearch
  pg_search_scope :default_search, :against => [:name, :description, :instructor, :weekday, :time, :year, :season], :using => {:tsearch => {:prefix => true}}
  default_scope { order(created_at: :asc) }

  has_many :enrolls, dependent: :destroy
  has_many :users, through: :enrolls

  validates :name, 
    presence: { message: "Title is required" }

  def enrolled
    self.enrolls.count
  end
end
