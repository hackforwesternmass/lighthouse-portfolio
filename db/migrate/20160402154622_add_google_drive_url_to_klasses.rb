class AddGoogleDriveUrlToKlasses < ActiveRecord::Migration
  def change
    add_column :klasses, :google_drive_url, :string
  end
end
