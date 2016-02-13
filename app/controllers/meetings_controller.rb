class MeetingsController < SessionsController
  before_action :signed_in

  def create
    meeting_params[:action_items_attributes] = meeting_params[:action_items_attributes].map { | k,v | [ k, v ] unless v[:description].empty? }.compact.to_h
    @meeting = Meeting.new(meeting_params)
    if @meeting.save
      render json: {meeting: @meeting, action_items: @meeting.action_items}, status: 200 
    else
      render json: @meeting.errors, status: 406
    end
  end

  def new
    @meeting = current_user.meetings.build
    @meeting.action_items.build
  end

  def index
    @meetings = current_user.meetings
  end

  def update
    meeting_params[:action_items_attributes] = meeting_params[:action_items_attributes].map { | k,v | [ k, v ] unless v[:description].empty? }.compact.to_h
    @meeting = Meeting.find(params[:id])
    if @meeting.update(meeting_params)
      render json: {meeting: @meeting, action_items: @meeting.action_items}, status: 200 
    else
      render json: @meeting.errors, status: 406
    end
  end

  def edit
  end

  def destroy
    Meeting.find(params[:id]).destroy
    render json: {}, status: 200 
  end
  
  private
    def meeting_params
      @meeting_params ||= params.require(:meeting).permit(:notes, :user_id,
        action_items_attributes: [:description, :due_date, :id])
    end

end
