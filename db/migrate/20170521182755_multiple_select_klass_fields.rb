class MultipleSelectKlassFields < ActiveRecord::Migration
  def change
    add_column :klasses, :years, :text, array: true, default: []
    add_column :klasses, :seasons, :text, array: true, default: []
  end
end
