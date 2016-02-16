class ResourcesController < SessionsController
  before_action :signed_in
  before_action :set_resource, only: [:show, :edit, :update, :destroy]

  def index
    @resources = current_user.resources.where(general: [nil, false]).group_by(&:category)
    @general_resources = Resource.where(general: true).group_by(&:category)

    respond_to do |format|
      format.json { render json: { general_resources: @general_resources, resources: @resources } }
      format.html 
    end

  end

  def new
    @resource = Resource.new
    params[:general].nil? ? @highlight_sidebar = "Resources" : @highlight_sidebar = "Admin"
  end

  def create
    @resource = current_user.resources.build(resource_params)
      if @resource.save
        redirect_to resources_path, flash: { notice: 'Resource created' }
      else
        flash.now[:alert] = 'Could not create your resource, try again!'
        render :new
      end
  end

  def update
    if @resource.update_attributes(resource_params)
      redirect_to resources_path, flash: { notice: "Resource updated" }
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
    @highlight_sidebar = "Resources"
  end

  def show
  end

  def destroy
    @resource.destroy
    render json: {}
  end

  private

    def set_resource
      @resource = Resource.find(params[:id])
    end

    def resource_params
      params.require(:resource).permit(:link, :category, :title, :description, :general)
    end

end
