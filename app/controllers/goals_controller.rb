class GoalsController < ApplicationController
  before_action :load_goal
  before_action :signed_in
  before_action :current_user


  def index
    @goals = Goal.all
  end

  def new
    @goal = Goal.new
  end

  def create
    @goal = Goal.new(goal_params)
    if @goal.save
      redirect_to root_path, flash: {notice: "Goal created"}
    else
      flash.now[:alert] = "Goal was not added"
      render :new
    end
  end

  def edit
  end

  def update
    if @goal.update_attributes(goal_params)
      redirect_to goals_path(@goal)
    else
      flash.now[:alert] = "Could not update goal"
      render :edit
    end
  end

  def show
  end

  def destroy
    @goal.destroy
    redirect_to root_path, flash: {notice: "Goal removed"}
  end

  private
    def goal_params
      params.require(:goal).permit(:title,:description,:is_completed,:progress,:due_date)
    end

    def load_goal
      @goal = Goal.find(params[:id])
    end
end
