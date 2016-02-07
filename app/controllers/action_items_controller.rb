class ActionItemsController < SessionsController
  before_action :signed_in

  layout "student"

  def create
  end

  def new
  end

  def update
    action_item = ActionItem.find params[:id]
    if action_item.update(action_item_params)
      render json: {}, status: 200
    else
      render json: {}, status: 406
    end
  end

  def edit
  end

  def destroy
    ActionItem.find(params[:id]).destroy
    render json: {}, status: 200
  end

  private
    def action_item_params
      params.require(:action_item).permit(:id, :due_date, :completed, :description)
    end 
end
