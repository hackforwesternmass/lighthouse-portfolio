class CreatePortfolio2Experiences < ActiveRecord::Migration
  def change
    create_table :portfolio2_experiences do |t|
      t.references :portfolio, index: true, foreign_key: true
      t.references :experience, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
