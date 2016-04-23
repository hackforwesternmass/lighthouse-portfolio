class AddPortfolioColorToUser < ActiveRecord::Migration
  def change
    add_column :users, :profile_color, :string
  end
end
