class KlassesController < SessionsController
  load_and_authorize_resource :klass, except: :user_index

  def index
    @klasses = Klass.where(year: 2016..Float::INFINITY)
    @highlight_sidebar = 'Dashboard'
    @klasses = @klasses.includes(:users)

    respond_to do |format|
      format.html
      format.json
    end
  end

  def user_index
    render json: User.find(active_id).klasses
  end

  def search
    klasses = Klass.all

    if params[:q].present?
      klasses =  Klass.default_search(params[:q])
    end

    if params[:year].present? && params[:year] != 'All'
      klasses = klasses.where(year: params[:year])
    end

    if params[:season].present? && params[:season] != 'All'
      klasses = klasses.where(season: params[:season])
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
        :year,
        :season,
        :instructor,
        :instructor_email,
        :instructor_phone,
        :location,
        :one_on_one,
        :google_drive_url
      )
    end

end
