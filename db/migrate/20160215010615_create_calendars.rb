class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.string :calendar_id
      t.boolean :show

      t.timestamps null: false
    end
  end
end
