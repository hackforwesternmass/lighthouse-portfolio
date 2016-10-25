class Calendar < ActiveRecord::Base

  before_save do
   self.show = true if self.calendar_id == ''
  end

end
