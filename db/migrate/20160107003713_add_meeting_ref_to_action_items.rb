class AddMeetingRefToActionItems < ActiveRecord::Migration
  def change
    add_reference :action_items, :meeting, index: true, foreign_key: true
  end
end
