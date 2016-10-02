class ResumeEntriesController < SessionsController
  load_and_authorize_resource :user
  load_and_authorize_resource :resume_entry, through: :user

  def index
  end

  def create
    if @resume_entry.save
      render :show, status: 200
    else
      render json: @resume_entry.errors, status: 422
    end
  end

  def show
  end

  def update
    if @resume_entry.update(resume_entry_params)
      render :show, status: 200
    else
      render json: @resume_entry.errors, status: 422
    end
  end

  def destroy
    @resume_entry.destroy
    head :no_content
  end

  private
  
    def resume_entry_params
      params.require(:resume_entry).permit(
        :id,
        :title,
        :subtitle,
        :description,
        :date
      )
    end
end
