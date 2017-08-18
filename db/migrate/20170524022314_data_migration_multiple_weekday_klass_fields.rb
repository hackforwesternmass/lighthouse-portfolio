class DataMigrationMultipleWeekdayKlassFields < ActiveRecord::Migration
  class Klass < ActiveRecord::Base
  end

  def up
    Klass.all.each do |klass|
      klass.weekdays << klass.weekday
      klass.save
    end
  end
end
