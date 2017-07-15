class KlassesController < SessionsController
  load_and_authorize_resource :klass

  def index
    @highlight_sidebar = 'Dashboard'
    @klasses = @klasses.includes(:users, :enrolls)

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

  def search
    klasses = Klass.all

    if params[:q].present?
      klasses =  Klass.default_search(params[:q])
    end

    if params[:year].present? && params[:year] != 'All'
      klasses = klasses.where('? = any (klasses.years)', params[:year])
    end

    if params[:season].present? && params[:season] != 'All'
      klasses = klasses.where('? = any (klasses.seasons)', params[:season])
    end

    if params[:type].present? && params[:type] == 'Tutorial'
      klasses = klasses.where(one_on_one: true, archive: false)
    elsif params[:type].present? && params[:type] == 'Archived'
      klasses = klasses.where(archive: true)
    elsif params[:type].present? && params[:type] == 'Regular'
      klasses = klasses.where(one_on_one: false, archive: false)
    elsif params[:type].present? && params[:type] == 'All'
      # DO NOTHING
    else
      klasses = klasses.where(archive: false)
    end

    render json: klasses.to_json(methods: :enrolled, include: :users)
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
