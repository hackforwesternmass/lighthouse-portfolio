class ReprocessPortfolioAvatars < ActiveRecord::Migration
  def up
    Portfolio.find_each do |portfolio|
      portfolio.avatar.reprocess!
    end
  end
end
