class ResourcesController < SessionsController
  before_action :signed_in
  before_action :set_resource, only: [:show, :edit, :update, :destroy]

  def index
    @resources = current_user.resources
  end

  def new
    @resource = Resource.new
  end

  def create
    @resource = current_user.resources.build(resource_params)
      if @resource.save
        redirect_to user_resources_path(current_user), flash: { notice: 'Resource created' }
      else
        flash.now[:alert] = 'Could not create your resource, try again!'
        render :new
      end
  end

  def update
    if @resource.update_attributes(resource_params)
      redirect_to user_resources_path(current_user), flash: { notice: "Resource updated" }
    else
      flash.now[:alert] = "Could not update resource"
      render :edit
    end
  end

  def change_category
    resources = Resource.where(category: params[:old_category])

    resources.each do |r|
      r.category = params[:new_category]
      r.save
    end

    render json: {category: params[:new_category] }

  end
  
  def edit
  end

  def show
  end

  def destroy
    @resource.destroy
    redirect_to [current_user, @resource], flash: { notice: "Resource removed" }
  end

  private

    def set_resource
      @resource = Resource.find(params[:id])
    end

    def resource_params
      params.require(:resource).permit(:link, :category, :title, :description)
    end

end
