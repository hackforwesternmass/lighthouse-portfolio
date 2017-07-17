class ReprocessPortfolioAvatars < ActiveRecord::Migration
  class Portfolio < ActiveRecord::Base
    has_attached_file :avatar,
                      default_url: -> (avatar) { ActionController::Base.helpers.asset_url('default-avatar.png') },
                      styles: { thumb: "100x100#", medium: '250x250#' }
  end

  def up
    Portfolio.find_each do |portfolio|
      portfolio.avatar.reprocess!
    end
  end
end
