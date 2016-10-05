class ClassPeriod < ActiveRecord::Base

  default_scope { order(start_time: :asc) }

end
