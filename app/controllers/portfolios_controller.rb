class PortfoliosController < ApplicationController
  load_and_authorize_resource :user
  load_and_authorize_resource :portfolio, through: :user, :singleton => true

  def show
  end

  def edit
  end

  def update
    if @portfolio.update(portfolio_params)
      redirect_to user_portfolio_path(@user), notice: 'Portfolio updated successfully!'
    else
      flash.now[:alert] = 'Failed to updated portfolio'
      render :edit
    end
  end

  private
    def portfolio_params
      params.require(:portfolio).permit(
        :avatar,
        :background,
        :description,
        :color,
        :private,
        social_mediums_attributes: [:link, :name,:_destroy, :id]
      )
    end
end
