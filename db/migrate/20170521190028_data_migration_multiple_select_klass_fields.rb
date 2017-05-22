class DataMigrationMultipleSelectKlassFields < ActiveRecord::Migration
  class Klass < ActiveRecord::Base
  end

  def up
    Klass.all.each do |klass|
      klass.years << klass.year
      klass.seasons << klass.season
      klass.save
    end
  end
end
