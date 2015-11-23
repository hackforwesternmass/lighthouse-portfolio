class AddUserIdToResource < ActiveRecord::Migration
  def change
    add_reference :resources, :user, index: true, foreign_key: true
    add_column :resources, :category, :string
  end
end
