class AddHideWeekViewToCalendars < ActiveRecord::Migration
  def change
    add_column :calendars, :hide_week_view, :boolean
  end
end
