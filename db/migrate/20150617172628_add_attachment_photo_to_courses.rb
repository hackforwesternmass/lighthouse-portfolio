class AddAttachmentPhotoToCourses < ActiveRecord::Migration
  def self.up
    change_table :courses do |t|
      t.attachment :photo
    end
  end

  def self.down
    remove_attachment :courses, :photo
  end
end
