class ProjectsController < SessionsController
  before_action :signed_in, except: [:public]
  before_action :set_sidebar_highlight
  before_action :set_project, only: [:show, :edit, :update, :destroy, :download, :public]

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
        redirect_to projects_path, flash: { notice: 'Portfolio piece created!' }
      else
        flash.now[:alert] = 'Could not create your project, try again!'
        render :new
      end
  end

  def update
    if @project.update_attributes(project_params)
      redirect_to @project, flash: { notice: 'Portfolio piece updated!' }
    else
      flash.now[:alert] = "Portfolio piece could not be updated."
      render :edit
    end
  end

  def tags
    @tags = current_user.tags
    @tags = @tags.where('name like ?', "%#{params[:q]}%") if params[:q]
  end

  def edit; end

  def show; end

  def public
    render layout: "public"
  end

  def download
    redirect_to @project.download_url
  end


  def destroy
    @project.destroy
    redirect_to projects_path, flash: { notice: 'Portfolio piece deleted' }
  end

  private

    def set_sidebar_highlight
      @highlight_sidebar = "Portfolio"
    end

    def set_project
      @project = Project.find(params[:id])
    end

    def project_params
      params.require(:project).permit(:title, :description, :link, :priority, :document,
        :body, :photo, :location, :date_completed, project_attachments_attributes: [:document, :_destroy, :id],
        tags_attributes: [:name, :_destroy, :id])
    end

end
