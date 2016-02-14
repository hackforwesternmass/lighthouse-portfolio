class DropCoursesTable < ActiveRecord::Migration
  def up
    drop_table :courses
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
