class AddEmailPhoneOneOnOneToKlass < ActiveRecord::Migration
  def change
    add_column :klasses, :instructor_email, :string
    add_column :klasses, :instructor_phone, :string
    add_column :klasses, :one_on_one, :boolean
    add_column :klasses, :location, :string
  end
end
