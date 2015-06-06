class CoursesController < ApplicationController
  before_action :load_course

  def index
    @courses = Course.all
  end

  def new
    @course = Course.new
  end

  def create
    @course = Course.new(course_params)
    if @course.save
      redirect_to root_path, flash: { notice: 'Course made.' }
    else
      flash.now[:alert] = 'Could not create the course'
      render :new
    end
  end

  def show
  end

  def update
    if @course.update_attributes(course_params)
      redirect_to courses_path(@course)
    else
      render :edit
    end
  end

  def destroy
    @course.destroy
    redirect_to :back
  end

  private
    def course_params
      params.require(:course).permit(:user_id,:name,:description,:category);
    end

    def load_course
      @course = Course.find(params[:id])
    end
end
