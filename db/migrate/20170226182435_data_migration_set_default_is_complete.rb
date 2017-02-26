class DataMigrationSetDefaultIsComplete < ActiveRecord::Migration

  class Goal < ActiveRecord::Base
  end

  def up
    Goal.find_each do |goal|
      goal.update(is_completed: false) unless goal.is_completed
    end
  end
end
