class DropCourseUsersTable < ActiveRecord::Migration
  def up
    drop_table :courses_users
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
