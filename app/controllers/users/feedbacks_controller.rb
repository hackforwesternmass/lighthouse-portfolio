module Users
  class FeedbacksController < SessionsController
    load_and_authorize_resource :user
    load_and_authorize_resource :feedback, through: :user

    def index
      @highlight_sidebar = 'Action Plan'
      @feedbacks = @feedbacks.order(created_at: :desc)
    end

    def create
      if @feedback.save
        redirect_to "#{action_plan_user_url(active_id)}#feedback"
      else
        render 'new'
      end
    end

    def new
      @highlight_sidebar = 'Action Plan'
    end

    def edit
      @highlight_sidebar = 'Action Plan'
    end

    def show
    end

    def update
      if @feedback.update(feedback_params)
        redirect_to "#{action_plan_user_url(active_id)}#feedback"
      else
        render 'edit'
      end
    end

    def destroy
      @feedback.destroy
      redirect_to "#{action_plan_user_url(active_id)}#feedback"
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
end
