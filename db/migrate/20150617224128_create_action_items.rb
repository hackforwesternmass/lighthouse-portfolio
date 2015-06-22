class CreateActionItems < ActiveRecord::Migration
  def change
    create_table :action_items do |t|
      t.date :due_date
      t.boolean :completed
      t.text :description
      t.references :action, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
