class KlassesController < SessionsController
  load_and_authorize_resource :klass

  def index
    @highlight_sidebar = 'Dashboard'
    @klasses = Klass.search(@klasses.includes(:users, :enrolls), params)

    respond_to do |format|
      format.html
      format.json
    end
  end

  def show
    respond_to do |format|
      format.csv { send_data(@klass.to_csv, filename: "#{@klass.name}.csv") }
      format.json
    end
  end

  def new
    @highlight_sidebar = 'Dashboard'
  end

  def create
    respond_to do |format|
      if @klass.save
        format.html { redirect_to klasses_path, flash: { notice: 'Class successfully created!' } }
        format.json { render :show, status: 200 }
      else
        format.html do
          flash.now[:alert] = 'Class unsuccessfully created.'
          render :new
        end
        format.json { render json: @klass.errors, status: 422 }
      end
    end
  end

  def update
    respond_to do |format|
      if @klass.update(klass_params)
        format.html { redirect_to klasses_path, flash: { notice: 'Class successfully updated!' } }
        format.json { render :show, status: 200 }
      else
        format.html do
          flash.now[:alert] = 'Class unsuccessfully updated.'
          render :edit
        end
        format.json { render json: @klass.errors, status: 422 }
      end
    end
  end

  def edit
    @highlight_sidebar = 'Dashboard'
  end

  def destroy
    @klass.destroy
    respond_to do |format|
      format.html { redirect_to klasses_path, flash: { notice: 'Class successfully deleted.' } }
      format.json { head :no_content }
    end
  end

  private

    def klass_params
      params.require(:klass).permit(
        :name,
        :description,
        :time,
        :instructor,
        :instructor_email,
        :instructor_phone,
        :location,
        :one_on_one,
        :google_drive_url,
        :archive,
        weekdays: [],
        years: [],
        seasons: []
      )
    end

end
