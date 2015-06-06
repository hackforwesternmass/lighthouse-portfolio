class CreateTopic2Courses < ActiveRecord::Migration
  def change
    create_table :topic2_courses do |t|
      t.references :topic, index: true, foreign_key: true
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
