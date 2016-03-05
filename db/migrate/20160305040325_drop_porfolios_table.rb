class DropPorfoliosTable < ActiveRecord::Migration
  def up
    drop_table :portfolios
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
