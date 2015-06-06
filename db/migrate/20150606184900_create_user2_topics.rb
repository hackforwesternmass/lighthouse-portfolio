class CreateUser2Topics < ActiveRecord::Migration
  def change
    create_table :user2_topics do |t|
      t.references :user, index: true, foreign_key: true
      t.references :topic, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
