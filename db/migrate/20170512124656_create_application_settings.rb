class CreateApplicationSettings < ActiveRecord::Migration
  def change
    create_table :application_settings do |t|
      t.boolean :hide_feedback, default: false
      t.string :calendar_id
      t.boolean :hide_calendar, default: false
      t.boolean :hide_week_view, default: false
      t.string :calendar_url

      t.timestamps null: false
    end
  end
end
