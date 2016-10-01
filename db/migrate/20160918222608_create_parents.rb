class CreateParents < ActiveRecord::Migration
  def change
    create_table :parents do |t|
      t.references :user, index: true, foreign_key: true
      t.integer :student_id

      t.timestamps null: false
    end
  end
end
