class MeetingsController < SessionsController
  load_and_authorize_resource :user
  load_and_authorize_resource :meeting, through: :user

  def index; end

  def create
    if @meeting.save
      render :show, status: 201
    else
      render json: @meeting.errors, status: 422
    end
  end

  def show; end

  def update
    if @meeting.update(meeting_params)
      render json: :show, status: 200
    else
      render json: @meeting.errors, status: 422
    end
  end

  def destroy
    @meeting.destroy
    head :no_content
  end

  private

  def meeting_params
    params.require(:meeting).permit(
    :notes,
    :user_id,
    action_items_attributes: [
      :id,
      :description,
      :due_date,
      :user_id,
      :completed,
      :_destroy
    ]
    )
  end
end
