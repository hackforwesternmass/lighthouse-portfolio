class Klass < ActiveRecord::Base

  has_many :enrolls, dependent: :destroy
  has_many :users, through: :enrolls

end
