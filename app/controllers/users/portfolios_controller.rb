module Users
  class PortfoliosController < ApplicationController
    load_and_authorize_resource :user
    load_and_authorize_resource :portfolio, through: :user, :singleton => true, except: [:public, :unfound]

    def show
      render layout: 'public' if current_user != @user && session[:student_id].blank?
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

    def public
      @user = User.joins(:portfolio).find_by(portfolios: { private: [nil, false] }, username: params[:username])
      if @user
        @portfolio = @user.portfolio
        render action: :show, layout: 'public'
      else
        redirect_to action: :unfound, params: { username: params[:username] }
      end
    end

    def unfound
      render layout: 'public'
    end

    private

    def portfolio_params
      params.require(:portfolio).permit(
        :avatar,
        :background,
        :description,
        :color,
        :private,
        social_mediums_attributes: [
          :link,
          :name,
          :_destroy,
          :id
        ]
      )
    end
  end
end
