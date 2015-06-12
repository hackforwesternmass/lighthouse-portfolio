class AddUserIdToGoals < ActiveRecord::Migration
  def change
  	add_column :goals, :user_id, :integer, index: true
  end
end
