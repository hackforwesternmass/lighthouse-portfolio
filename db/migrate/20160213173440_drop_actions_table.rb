class DropActionsTable < ActiveRecord::Migration
  def up
    drop_table :actions, force: :cascade
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
