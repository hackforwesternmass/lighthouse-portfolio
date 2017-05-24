class MultipleWeekdayKlassFields < ActiveRecord::Migration
  def change
    add_column :klasses, :weekdays, :text, array: true, default: []
  end
end
