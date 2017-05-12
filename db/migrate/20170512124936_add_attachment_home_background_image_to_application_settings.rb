class AddAttachmentHomeBackgroundImageToApplicationSettings < ActiveRecord::Migration
  def self.up
    change_table :application_settings do |t|
      t.attachment :home_background_image
    end
  end

  def self.down
    remove_attachment :application_settings, :home_background_image
  end
end
