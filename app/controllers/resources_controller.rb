class ResourcesController < SessionsController
  before_action :signed_in
  before_action :set_resource, only: [:show, :edit, :update, :destroy]
  
  layout "student"

  def index
    @resources = current_user.resources
  end

  def new
    @resource = current_user.resources.build
  end

  def create
    @resource = current_user.resources.build(resource_params)
      if @resource.save
        redirect_to user_resources_path(current_user), flash: { notice: 'Resource Created!' }
      else
        flash.now[:alert] = 'Could not create your resource, try again!'
        render :new
      end
  end

  def update
    if @resource.update_attributes(resource_params)
      redirect_to resources_path(@resource)
    else
      flash.now[:alert] = "Could not update resource"
      render :edit
    end
  end

  def edit
  end

  def show
  end

  def destroy
    @resource.destroy
    redirect_to :root_path, flash: {notice: "Resource removed"}
  end

  private

    def set_project
      @resource = Resource.find(params[:id])
    end

    def resource_params
      params.require(:resource).permit(:link, :category, :title)
    end

end
