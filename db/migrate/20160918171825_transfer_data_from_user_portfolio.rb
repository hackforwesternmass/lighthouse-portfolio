class TransferDataFromUserPortfolio < ActiveRecord::Migration
  def change
    User.all.each do |u|
      u.portfolio.update(
        description: u.description,
        color: u.profile_color,
        private: u.private,
        background: u.profile_background,
        avatar: u.avatar
      )
    end
  end
end
