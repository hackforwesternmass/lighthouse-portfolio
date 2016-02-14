class CreateEnrolls < ActiveRecord::Migration
  def change
    create_table :enrolls do |t|
      t.references :user, index: true, foreign_key: true
      t.references :klass, index: true, foreign_key: true
      t.boolean :completed

      t.timestamps null: false
    end
  end
end
