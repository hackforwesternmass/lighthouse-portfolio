class RemoveTopicsFromCourses < ActiveRecord::Migration
  def change
    remove_column :courses, :topics, :string
  end
end
