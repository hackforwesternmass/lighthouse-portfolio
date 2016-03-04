class ActionItemsController < SessionsController
  before_action :signed_in

  def update
    action_item = ActionItem.find params[:id]
    if action_item.update(action_item_params)
      render json: {}, status: 200
    else
      render json: {}, status: 400
    end
  end

  def destroy
    ActionItem.find(params[:id]).destroy
    render json: {}, status: 200
  end

  private
    def action_item_params
      params.require(:action_item).permit(:id, :due_date, :completed, :description, :user_id)
    end 
end
