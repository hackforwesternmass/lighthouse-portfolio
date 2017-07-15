class AddArchiveToKlass < ActiveRecord::Migration
  def change
    add_column :klasses, :archive, :boolean, default: false
  end
end
