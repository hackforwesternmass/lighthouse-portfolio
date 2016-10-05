class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionHelper

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.html { redirect_to root_path, :alert => exception.message }
      format.json { render json: {}, status: 403 }
    end
  end
  
end
