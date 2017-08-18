class ConvertDatetimeToDate < ActiveRecord::Migration
  def change
    change_column :goals, :due_date, :date
  end
end
