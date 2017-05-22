class KlassesController < SessionsController
  load_and_authorize_resource :klass

  def index
    @klasses = Klass.where(year: 2016..Float::INFINITY)
    @highlight_sidebar = 'Dashboard'
    @klasses = @klasses.includes(:users)

    respond_to do |format|
      format.html
      format.json
    end
  end

  def show
    respond_to do |format|
      format.csv { send_data(@klass.to_csv, filename: "#{@klass.name}.csv") }
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
      klasses = klasses.where(one_on_one: true)
    elsif params[:type].present? && params[:type] != 'All'
      klasses = klasses.where(one_on_one: false)
    end

    render json: klasses.to_json(methods: :enrolled, include: :users)
  end

  def new
    @highlight_sidebar = 'Dashboard'
  end

  def create
    if @klass.save
      redirect_to klasses_path, flash: { notice: 'Class successfully created!' }
    else
      flash.now[:alert] = 'Class unsuccessfully created.'
      render :new
    end
  end

  def update
    if @klass.update(klass_params)
      redirect_to klasses_path, flash: { notice: 'Class successfully updated!' }
    else
      flash.now[:alert] = 'Class unsuccessfully updated.'
      render :edit
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
        :weekday,
        :instructor,
        :instructor_email,
        :instructor_phone,
        :location,
        :one_on_one,
        :google_drive_url,
        years: [],
        seasons: []
      )
    end

end
