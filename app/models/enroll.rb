class Enroll < ActiveRecord::Base
  belongs_to :user
  belongs_to :klass

  validates :user_id, uniqueness: { scope: :klass_id }
end
