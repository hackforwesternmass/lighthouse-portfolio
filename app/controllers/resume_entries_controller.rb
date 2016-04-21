class ResumeEntriesController < SessionsController
  before_action :signed_in

  def index
    @resume_entries = current_user.resume_entries
    render json: @resume_entries
  end

  def create
    if current_user.resume_entries.create(resume_entry_params)
      render json: {}, status: 200
    else
      render json: {}, status: 400
    end
  end

  def update
    resume_entry = ResumeEntry.find params[:id]
    if resume_entry.update(resume_entry_params)
      render json: {}, status: 200
    else
      render json: {}, status: 400
    end
  end

  def destroy
    ResumeEntry.find(params[:id]).destroy
    render json: {}, status: 200
  end

  private
    def resume_entry_params
      params.require(:resume_entry).permit(:id, :title, :subtitle, :description, :date)
    end 
end
