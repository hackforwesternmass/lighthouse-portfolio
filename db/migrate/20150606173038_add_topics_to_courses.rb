class AddTopicsToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :topics, :string
  end
end
