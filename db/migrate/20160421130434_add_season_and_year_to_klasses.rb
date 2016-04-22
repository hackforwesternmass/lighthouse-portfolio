class AddSeasonAndYearToKlasses < ActiveRecord::Migration
  def change
    remove_column :klasses, :start_date, :date
    remove_column :klasses, :end_date, :date
    add_column :klasses, :season, :string
    add_column :klasses, :year, :integer
  end
end
