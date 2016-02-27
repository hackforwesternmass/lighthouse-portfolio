class AddDatesToKlasses < ActiveRecord::Migration
  def change
    add_column :klasses, :start_date, :date
    add_column :klasses, :end_date, :date
  end
end
