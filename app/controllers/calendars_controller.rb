class CalendarsController < SessionsController
  load_and_authorize_resource :calendar, except: :calendar

  def calendar
  end

  def manage
    @calendar = Calendar.first || Calendar.new
    @highlight_sidebar = "Dashboard"
  end

  def create
    @calendar = Calendar.new(calendar_params)
    if @calendar.save
      redirect_to admin_dashboard_path, flash: { notice: "Calendar setup successfully." }
    else
      flash.now[:alert] = 'Failed to update calendar settings.'
      render :manage
    end

  end

  def update
    @calendar = Calendar.first
    if @calendar.update(calendar_params)
      redirect_to admin_dashboard_path, flash: { notice: "Calendar updated successfully." }
    else
      flash.now[:alert] = 'Failed to update calendar settings.'
      render :manage
    end
  end

  private

    def calendar_params
      params.require(:calendar).permit(
        :calendar_id,
        :show,
        :hide_week_view,
        :calendar_url
      )
    end
    
end
