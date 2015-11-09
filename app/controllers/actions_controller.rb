class ActionsController < SessionsController
  before_action :signed_in
  before_action :current_user

  def index
    @Actions = Action.all
  end

  # GET /Actions/1
  # GET /Actions/1.json
  def show
  end

  # GET /Actions/new
  def new
    @action = Action.new
  end

  # GET /Actions/1/edit
  def edit
  end

  # POST /Actions
  # POST /Actions.json
  def create
    goal = Goal.find params[:goal_id]
    @action = goal.actions.build(action_params)
    if @action.save
      redirect_to user_goals_path(@user)
    else
      flash.now[:alert] = "Action was added"
      render :new
    end
  end

  # PATCH/PUT /Actions/1
  # PATCH/PUT /Actions/1.json
  def update
    respond_to do |format|
      if @Action.update(Action_params)
        format.html { redirect_to @Action, notice: 'Action was successfully updated.' }
        format.json { render :show, status: :ok, location: @Action }
      else
        format.html { render :edit }
        format.json { render json: @Action.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /Actions/1
  # DELETE /Actions/1.json
  def destroy
    @Action.destroy
    respond_to do |format|
      format.html { redirect_to Actions_url, notice: 'Action was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_Action
      @action = Action.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def action_params
      # params.require(:action).permit(:note)
    end
end
