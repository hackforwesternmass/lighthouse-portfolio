class Goal < ActiveRecord::Base
	belongs_to :user
	before_create :set_default_progress

	has_many :actions
	
	scope :newest, -> { order(:created_at => :desc) }
	scope :create_before, -> (time){ where('created_at < ?', time) }
	scope :current_goals, -> { newest.where('is_completed = False' && 'progress < 100') }
	scope :past_goals, -> { where('is_completed = True' && 'progress = 100') }

	private

	def set_default_progress
		self.progress = 0
	end

end
