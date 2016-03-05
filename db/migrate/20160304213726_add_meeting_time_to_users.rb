class AddMeetingTimeToUsers < ActiveRecord::Migration
  def change
    add_column :users, :meeting_time, :string
  end
end
