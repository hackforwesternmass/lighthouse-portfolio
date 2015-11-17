class AddIconToSocialMedium < ActiveRecord::Migration
  def change
    add_column :social_media, :icon, :string
  end
end
