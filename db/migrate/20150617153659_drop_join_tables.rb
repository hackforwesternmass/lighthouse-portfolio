class DropJoinTables < ActiveRecord::Migration
  def change
  	drop_table :student2_courses
  	drop_table :topic2_courses
  	drop_table :user2_topics
  	drop_table :portfolio2_experiences
  	drop_table :portfolio2_courses
  	drop_table :experiences
  end
end
