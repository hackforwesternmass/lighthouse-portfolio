class AddArchiveToUsers < ActiveRecord::Migration
  def change
    add_column :users, :archive, :boolean, default: false
  end
end
