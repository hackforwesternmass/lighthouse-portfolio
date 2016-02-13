class GoalsController < SessionsController
  before_action :signed_in

  def create
    goal_params[:action_items_attributes] = goal_params[:action_items_attributes].map { | k,v | [ k, v ] unless v[:description].empty? }.compact.to_h if goal_params[:action_items_attributes]
    @goal = Goal.new(goal_params)
    if @goal.save
      render json: {goal: @goal}, status: 200 
    else
      render json: @goal.errors, status: 406
    end
  end

  def new
    @goal = current_user.goals.build
    @goal.action_items.build
  end

  def index
    @goals = current_user.goals
  end

  def update
    goal_params[:action_items_attributes] = goal_params[:action_items_attributes].map { | k,v | [ k, v ] unless v[:description].empty? }.compact.to_h if goal_params[:action_items_attributes]
    @goal = goal.find(params[:id])
    if @goal.update(goal_params)
      render json: {goal: @goal}, status: 200 
    else
      render json: @goal.errors, status: 406
    end
  end

  def edit
  end

  def destroy
    Goal.find(params[:id]).destroy
    render json: {}, status: 200 
  end
  
  private
    def goal_params
      @goal_params ||= params.require(:goal).permit(:title, :description, :is_completed, :due_date, :user_id,
        action_items_attributes: [:description, :due_date, :id])
    end

end
