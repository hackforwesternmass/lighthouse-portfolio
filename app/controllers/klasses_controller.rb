class KlassesController < SessionsController
  before_action :signed_in
  before_action :set_klass, only: [:show, :edit, :update, :destroy]

  def index
    @klasses = Klass.where("(klasses.season = 'Winter' AND klasses.year = '2016') OR (klasses.season = 'Fall' AND klasses.year = '2015')")
    @highlight_sidebar = "Admin"

    respond_to do |format|
      format.json { render json: @klasses.to_json(methods: :enrolled) }
      format.html
    end
  end

  def user_index
    render json: current_user.klasses
  end

  def search
    klasses = Klass.all

    if params[:q].present?
      klasses =  Klass.default_search(params[:q])
    end

    if params[:year].present? && params[:year] != "All"
      klasses = klasses.where(year: params[:year])
    end

    if params[:season].present? && params[:season] != "All"
      klasses = klasses.where(season: params[:season])
    end

    render json: klasses.to_json(methods: :enrolled)

  end

  def new
    @klass = Klass.new
    @highlight_sidebar = "Admin"
  end

  def create
    @klass = Klass.new(klass_params)
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
      flash.now[:alert] = "Class unsuccessfully updated."
      render :edit
    end
  end

  def edit
    @highlight_sidebar = "Admin"
  end

  def show
  end

  def destroy
    @klass.destroy
    redirect_to @klass, flash: { notice: "Class successfully deleted." }
  end

  private

    def set_klass
      @klass = Klass.find(params[:id])
    end

    def klass_params
      params.require(:klass).permit(:name, :description, :time, :weekday, :year, :season,
        :instructor, :instructor_email, :instructor_phone, :location, :one_on_one, :google_drive_url)
    end

end
