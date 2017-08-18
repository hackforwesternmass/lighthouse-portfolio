class Enroll < ActiveRecord::Base
  belongs_to :user
  belongs_to :klass
  validates :user_id, uniqueness: { scope: :klass_id }
  validate :archived_user

  def archived_user
    if user.archive
      errors.add(:user_archived, 'Can not enroll archived students')
    end
  end
end
