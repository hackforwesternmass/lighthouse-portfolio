class CreateBackgroundImages < ActiveRecord::Migration
  def change
    create_table :background_images do |t|
      t.attachment :image
      t.timestamps null: false
    end
  end
end
