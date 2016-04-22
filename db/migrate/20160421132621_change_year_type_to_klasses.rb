class ChangeYearTypeToKlasses < ActiveRecord::Migration
  def change
    remove_column :klasses, :year, :integer
    add_column :klasses, :year, :string
  end
end
