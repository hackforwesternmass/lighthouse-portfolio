class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string :name
      t.string :subject
      t.text :text

      t.timestamps null: false
    end
  end
end
