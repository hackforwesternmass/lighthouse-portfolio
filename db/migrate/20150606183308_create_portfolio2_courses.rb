class CreatePortfolio2Courses < ActiveRecord::Migration
  def change
    create_table :portfolio2_courses do |t|
      t.references :portfolio, index: true, foreign_key: true
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
