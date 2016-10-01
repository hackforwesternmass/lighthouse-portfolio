class CreatePortfolios < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.text :description
      t.string :color
      t.boolean :private
      t.attachment :background
      t.attachment :avatar
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
