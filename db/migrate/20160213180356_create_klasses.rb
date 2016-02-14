class CreateKlasses < ActiveRecord::Migration
  def change
    create_table :klasses do |t|
      t.string :name
      t.text :description
      t.string :weekday
      t.string :time
      t.string :instructor

      t.timestamps null: false
    end
  end
end
