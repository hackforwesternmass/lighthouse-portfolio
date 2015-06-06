class TopicsController < ApplicationController
	before_action :load_topic

  def index
	@topics = Topic.all
  end

  def new
    @topic = Topic.new
  end

  def create
    @topic = Topic.new(topic_params)
    if @topic.save
      redirect_to root_path, flash: { notice: 'Topic made.' }
    else
      flash.now[:alert] = 'Could not create the topic'
      render :new
    end
  end

  def show
  end

  def update
    if @topic.update_attributes(topic_params)
      redirect_to topics_path(@topic)
    else
      render :edit
    end
  end

  def destroy
	@topic.destroy
	redirect_to :back
  end

  private
    def topic_params
      params.require(:topic).permit(:title,:description);
    end

    def load_topic
    	@topic = Topic.find(params[:id])
    end
end
