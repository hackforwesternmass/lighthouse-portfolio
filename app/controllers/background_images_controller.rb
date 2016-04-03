class BackgroundImagesController < SessionsController
  before_action :signed_in

  def manage
    @background_image = BackgroundImage.first || BackgroundImage.new
    @highlight_sidebar = "Admin"
  end

  def create
    @background_image = BackgroundImage.new(background_image_params)

    if @background_image.save
      redirect_to admin_dashboard_path, flash: { notice: "Background image setup successfully." }
    else
      render :manage
    end

  end

  def update
    @background_image = BackgroundImage.first

    if @background_image.update(background_image_params)
      redirect_to admin_dashboard_path, flash: { notice: "Background image updated successfully." }
    else
      render :manage
    end
  end

  private

    def background_image_params
      params.require(:background_image).permit(:image)
    end

end
