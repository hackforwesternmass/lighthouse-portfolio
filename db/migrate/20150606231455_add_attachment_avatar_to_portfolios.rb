class AddAttachmentAvatarToPortfolios < ActiveRecord::Migration
  def self.up
    change_table :portfolios do |t|
      t.attachment :avatar
    end
  end

  def self.down
    remove_attachment :portfolios, :avatar
  end
end
