module Users
  class KlassesController < SessionsController
    load_and_authorize_resource :user
    load_and_authorize_resource :klass, through: :user, except: [:update]

    def index
      @highlight_sidebar = 'Dashboard'
      @klasses = @user.uncompleted_klasses if params[:current].present?
      # @klasses = @klasses.includes(:users, :enrolls)
    end

    def update
      @klass = Klass.find(params[:id])
      if @klass.update(klass_params)
        @klasses = @user.klasses
        render json: {}, status: 200
      else
        render json: @klass.errors, status: 422
      end
    end

    private

    def klass_params
      params.require(:klass).permit(
        :name,
        :description,
        :time,
        :weekday,
        :year,
        :season,
        :instructor,
        :instructor_email,
        :instructor_phone,
        :location,
        :one_on_one,
        :google_drive_url,
        enrolls_attributes: [
          :id,
          :user_id,
          :completed,
          :_destroy
        ]
      )
    end

  end

end
