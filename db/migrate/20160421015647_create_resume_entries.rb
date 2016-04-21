class CreateResumeEntries < ActiveRecord::Migration
  def change
    create_table :resume_entries do |t|
      t.string :title
      t.string :subtitle
      t.string :date
      t.text :description
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
