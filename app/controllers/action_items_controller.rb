class ActionItemsController < SessionsController
  load_and_authorize_resource :user
  authorize_resource :action_item, through: :user

  def index
    @incomplete = @user.admin_action_items.where(completed: [false, nil]).order(due_date: :asc)
    @complete = @user.admin_action_items.where(completed: true, archive: [false, nil]).order( updated_at: :desc)
    @action_items = @user.action_items.order(due_date: :asc).where(archive: [false, nil])
    @archived_action_items = @user.action_items.order(due_date: :asc).where(archive: true)
  end

  def update
    @action_item = ActionItem.find(params[:id])
    if @action_item.update(action_item_params)
      render json: {}, status: 200
    else
      render json: @action_item.errors, status: 422
    end
  end

  private
  
    def action_item_params
      params.require(:action_item).permit(
        :id,
        :due_date,
        :completed,
        :description,
        :user_id,
        :archive
      )
    end
end
