module Admin
  class ApplicationSettingsController < SessionsController
    load_and_authorize_resource :application_setting, except: :calendar

    def calendar
    end

    def show
      @application_settings = ApplicationSetting.find 1
      render json: @application_settings.to_json(methods: :home_background_image_url)
    end

    def edit
    end

    def update
      @application_settings = ApplicationSetting.find 1
      if @application_settings.update(application_settings_params)
        render json: @application_settings
      else
        render json: @application_settings.errors, status: 422
      end
    end

    private

    def application_settings_params
      params.require(:application_settings).permit(
        :calendar_id,
        :hide_calendar,
        :hide_week_view,
        :calendar_url,
        :hide_feedback,
        :home_background_image
      )
    end
  end
end
