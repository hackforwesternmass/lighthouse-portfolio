class AddDraftToMeeting < ActiveRecord::Migration
  def change
    add_column :meetings, :draft, :boolean, default: false
  end
end
