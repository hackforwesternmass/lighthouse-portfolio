class Goal < ActiveRecord::Base
	belongs_to :user
	scope :newest_first, -> {order(:created_at => :desc)}
	scope :create_before, -> (time){where('created_at < ?', time)}
	scope :current_goals, -> {newest_first.where('is_completed = False' && 'progress < 100')}
	scope :past_goals, -> {where('is_completed = True' && 'progress = 100')}
end
