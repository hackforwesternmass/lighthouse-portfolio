class AddPortfolioToAllExistingUsers < ActiveRecord::Migration
  def up
    User.all.each(&:create_portfolio)
  end

  def down
    User.all.each { |u| user.portfolio.destroy }
  end
end
