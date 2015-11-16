class AddPriorityToProject < ActiveRecord::Migration
  def change
    add_column :projects, :priority, :boolean
  end
end
