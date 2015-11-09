class AddBodyToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :body, :text
  end
end
