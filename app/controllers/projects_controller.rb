class ProjectsController < SessionsController
  load_and_authorize_resource :user
  load_and_authorize_resource :project, through: :user
  before_action :set_sidebar_highlight

  def new
    @project.tags.build
  end

  def create
    if @project.save
      redirect_to [@user, @project], flash: { notice: 'Project successfully created!' }
    else
      flash.now[:alert] = 'Could not create your project, some fields may have been missing!'
      render :new
    end
  end

  def update
    if @project.update(project_params)
      redirect_to [@user, @project], flash: { notice: 'Project updated!' }
    else
      flash.now[:alert] = 'Project could not be updated.'
      render :edit
    end
  end

  def tags
    @tags = @user.tags
    @tags = @tags.where('name like ?', "%#{params[:q]}%") if params[:q].present?
  end

  def edit; end

  def show
    render layout: 'public'
  end

  def download
    redirect_to @project.download_url
  end

  def destroy
    @project.destroy
    redirect_to user_projects_path(@user), flash: { notice: 'Portfolio piece deleted' }
  end

  private

  def set_sidebar_highlight
    @highlight_sidebar = 'Portfolio'
  end

  def project_params
    params.require(:project).permit(
      :title,
      :description,
      :link,
      :priority,
      :document,
      :body,
      :photo,
      :location,
      :date_completed,
      tags_attributes: [
        :name,
        :_destroy,
        :id
      ]
    )
  end
  
end
