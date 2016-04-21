class ActionItemsController < SessionsController
  before_action :signed_in

  def index
    @incomplete = @user.admin_action_items.where(completed: [false, nil]).order(due_date: :asc)
    @complete = @user.admin_action_items.where(completed: true).order( updated_at: :desc)
  end

  def update
    action_item = ActionItem.find params[:id]
    if action_item.update(action_item_params)
      render json: {}, status: 200
    else
      render json: {}, status: 400
    end
  end

  def complete
    action_item = ActionItem.find params[:id]
    if action_item.update(completed: true)
      render json: { id: action_item.id }, status: 200
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
