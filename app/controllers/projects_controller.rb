class ProjectsController < SessionsController
  before_action :signed_in
  before_action :current_user

  layout "student"
  
  def index
    @projects = Project.all
  end

  def new
    @project = current_user.projects.build
  end

  def create
    @project = @user.projects.build(project_params)
      if @project.save
        redirect_to user_portfolios_path(user_id: @user.id), flash: { notice: 'Project Created!' }
      else
        flash.now[:alert] = 'Could not create your project, try again!'
        render :new
      end
  end

  def update
    if @project.update_attributes(project_params)
      redirect_to projects_path(@project)
    else
      flash.now[:alert] = "Could not update project"
      render :edit
    end
  end

  def edit
  end

  def show
    @project = Project.find(params[:id])
  end

  def destroy
    project = Project.find params[:id]
    project.destroy
    render nothing: true
  end

  private
    def project_params
      params.require(:project).permit(:title, :description, :resume, :difficulty, :link, :photo)
    end

end
