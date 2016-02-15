class AddGeneralToResources < ActiveRecord::Migration
  def change
    add_column :resources, :general, :boolean
  end
end
