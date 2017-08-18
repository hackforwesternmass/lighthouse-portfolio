class DataMigrationToApplicationSetting < ActiveRecord::Migration
  class Calendar < ActiveRecord::Base
  end

  def up
    calendar = Calendar.find_by id: 1
    application_settings = ApplicationSetting.find_or_create_by id: 1

    if calendar.present?
      application_settings.update(
        hide_calendar: !calendar.show,
        hide_week_view: calendar.hide_week_view,
        calendar_id: calendar.calendar_id,
        calendar_url: calendar.calendar_url
      )
    end

  end
end
