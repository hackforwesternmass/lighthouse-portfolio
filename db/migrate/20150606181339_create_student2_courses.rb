class CreateStudent2Courses < ActiveRecord::Migration
  def change
    create_table :student2_courses do |t|
      t.references :user, index: true, foreign_key: true
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
