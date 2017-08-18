class DataMigrationDowncaseAllEmails < ActiveRecord::Migration
  class User < ActiveRecord::Base
  end

  def up
    User.find_each do |user|
      user.update(email: user.email.downcase)
    end
  end
end
