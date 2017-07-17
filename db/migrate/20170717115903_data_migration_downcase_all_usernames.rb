class DataMigrationDowncaseAllUsernames < ActiveRecord::Migration
  class User < ActiveRecord::Base
  end
  
  def up
    User.find_each do |user|
      user.update(username: user.username.downcase) if user.username.present?
    end
  end
end
