class FeedbacksController < SessionsController
  load_and_authorize_resource :feedback

  def index
    @highlight_sidebar = 'Dashboard'
    @feedbacks = Feedback.paginate(page: params[:page], per_page: 10).order(created_at: :desc)
  end

  def create
    if @feedback.save
      redirect_to action: :index
    else
      render 'new'
    end
  end

  def new
    @highlight_sidebar = 'Dashboard'
  end

  def edit
    @highlight_sidebar = 'Dashboard'
  end

  def show
  end

  def update
    if @feedback.update(feedback_params)
      redirect_to action: :index
    else
      render 'edit'
    end
  end

  def destroy
    @feedback.destroy
    redirect_to action: :index
  end

  private

  def feedback_params
    params.require(:feedback).permit(
      :name,
      :text,
      :subject
    )
  end

end
