class KlassesController < SessionsController
  before_action :signed_in
  before_action :set_klass, only: [:show, :edit, :update, :destroy]

  def index
    @klasses = Klass.all
  end

  def new
    @klass = Klass.new
  end

  def create
    if Klass.create(klass_params)
      redirect_to klasses_path, flash: { notice: 'Class successfully created!' }
    else
      flash.now[:alert] = 'Could not create your class, try again!'
      render :new
    end
  end

  def update
    # if @klasse.update_attributes(klasse_params)
    #   redirect_to user_klasses_path(current_user), flash: { notice: "klasse updated" }
    # else
    #   flash.now[:alert] = "Could not update klasse"
    #   render :edit
    # end
  end
  
  def edit
  end

  def show
  end

  def destroy
    @klass.destroy
    redirect_to [current_user, @klass], flash: { notice: "Class removed" }
  end

  private

    def set_klass
      @klass = Klass.find(params[:id])
    end

    def klass_params
      params.require(:klass).permit(:name, :description, :time, :weekday, :instructor)
    end

end
