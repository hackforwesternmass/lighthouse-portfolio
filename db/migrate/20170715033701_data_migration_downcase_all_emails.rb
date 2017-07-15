class DataMigrationDowncaseAllEmails < ActiveRecord::Migration
  def up
    User.find_each do |user|
      user.update(email: user.email.downcase)
    end
  end
end
