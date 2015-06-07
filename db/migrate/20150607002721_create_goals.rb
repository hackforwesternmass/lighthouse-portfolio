class CreateGoals < ActiveRecord::Migration
  def change
    create_table :goals do |t|
    	t.string :title
    	t.text :description
    	t.boolean :is_completed
    	t.integer :progress
    	
    	t.datetime :due_date
      t.timestamps null: false
    end
  end
end
