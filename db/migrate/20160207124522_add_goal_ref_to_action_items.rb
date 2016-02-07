class AddGoalRefToActionItems < ActiveRecord::Migration
  def change
    add_reference :action_items, :goal, index: true, foreign_key: true
  end
end
