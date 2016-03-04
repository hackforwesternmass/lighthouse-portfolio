class AddAdminRedToActionItems < ActiveRecord::Migration
  def change
    add_reference :action_items, :user, index: true, foreign_key: true
  end
end
