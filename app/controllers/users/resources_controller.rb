module Users
  class ResourcesController < SessionsController
    load_and_authorize_resource :user
    load_and_authorize_resource :resource, through: :user

    def index
      @resources = @user.resources.where(general: [nil, false]).group_by(&:category)
      @general_resources = Resource.where(general: true).group_by(&:category)

      respond_to do |format|
        format.html
        format.json { render json: { general_resources: @general_resources, resources: @resources } }
      end
    end

    def new
      params[:general].nil? ? @highlight_sidebar = 'Resources' : @highlight_sidebar = 'Dashboard'
    end

    def create
      if @resource.save
        redirect_to user_resources_path(@user), flash: { notice: 'Resource created successfully!' }
      else
        render :new
      end
    end

    def update
      if @resource.update(resource_params)
        redirect_to user_resources_path(@user), flash: { notice: 'Resource updated successfully!' }
      else
        flash.now[:alert] = 'Failed to update resource.'
        render :edit
      end
    end

    def change_category
      resources = Resource.where(category: params[:old_category])
      resources.update_all({ category: params[:new_category] })
      render json: { category: params[:new_category] }
    end

    def edit
      @highlight_sidebar = 'Resources'
    end

    def show
    end

    def destroy
      @resource.destroy
      respond_to do |format|
        format.html { redirect_to user_resources_path(@user), flash: { notice: "Resource successfully deleted" } }
        format.json { head :no_content }
      end
    end

    private

      def resource_params
        params.require(:resource).permit(
          :link,
          :category,
          :title,
          :description,
          :general
        )
      end
    end
end
