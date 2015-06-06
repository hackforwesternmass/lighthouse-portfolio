class AddTitleToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :title, :string
  end
end
