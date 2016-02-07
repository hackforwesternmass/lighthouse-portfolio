class AddUserRefToMeetings < ActiveRecord::Migration
  def change
    add_reference :meetings, :user, index: true, foreign_key: true
  end
end
