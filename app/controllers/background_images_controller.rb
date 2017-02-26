class BackgroundImagesController < SessionsController
  load_and_authorize_resource

  def manage
    @background_image = BackgroundImage.first || BackgroundImage.new
    @highlight_sidebar = "Dashboard"
  end

  def create
    if @background_image.save
      redirect_to admin_dashboard_path, flash: { notice: "Background image setup successfully." }
    else
      flash.now[:alert] = 'Failed to update background image.'
      render :manage
    end
  end

  def update
    @background_image = BackgroundImage.first
    if @background_image.update(background_image_params)
      redirect_to admin_dashboard_path, flash: { notice: "Background image updated successfully." }
    else
      flash.now[:alert] = 'Failed to update background image.'
      render :manage
    end
  end

  private

    def background_image_params
      params.require(:background_image).permit(:image)
    end
    
end
