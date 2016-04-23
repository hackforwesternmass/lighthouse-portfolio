class AddArchiveToActionItem < ActiveRecord::Migration
  def change
    add_column :action_items, :archive, :boolean
  end
end
