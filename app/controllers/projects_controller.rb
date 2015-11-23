class ProjectsController < SessionsController
  before_action :signed_in
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  layout "student"
  
  def index
    @projects = @user.projects
  end

  def new
    @project = current_user.projects.build
    @project.project_attachments.build
    @project.tags.build
  end

  def create
    @project = current_user.projects.build(project_params)
      if @project.save
        redirect_to user_projects_path(user_id: @user.id), flash: { notice: 'Portfolio piece created!' }
      else
        flash.now[:alert] = 'Could not create your project, try again!'
        render :new
      end
  end

  def update
    if @project.update_attributes(project_params)
      redirect_to [@project.user, @project]
    else
      flash.now[:alert] = "Could not update project"
      render :edit
    end
  end

  def edit
  end

  def show; end

  def destroy
    @project.destroy
    redirect_to user_projects_path(user_id: @user.id), flash: { notice: 'Portfolio piece deleted' }
  end

  private

    def set_project
      @project = Project.find(params[:id])
    end

    def project_params
      params.require(:project).permit(:title, :description, :link, :priority, 
        :body, :photo, :location, :date_completed, project_attachments_attributes: [:document, :_destroy, :id],
        tags_attributes: [:name, :_destroy, :id])
    end

end
