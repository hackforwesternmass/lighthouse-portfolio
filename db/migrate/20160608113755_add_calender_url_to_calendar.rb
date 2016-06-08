class AddCalenderUrlToCalendar < ActiveRecord::Migration
  def change
    add_column :calendars, :calendar_url, :string
  end
end
