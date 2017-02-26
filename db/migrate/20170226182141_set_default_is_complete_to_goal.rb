class SetDefaultIsCompleteToGoal < ActiveRecord::Migration
  def change
    change_column :goals, :is_completed, :boolean, default: false
  end
end
