class CalendarController < SessionsController
  before_action :signed_in

  layout "student"

  def calendar
  end

end
