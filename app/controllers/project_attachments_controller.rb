class ProjectAttachmentsController < ApplicationController

  def download
    project_attachment = ProjectAttachment.find params[:id]
    redirect_to project_attachment.download_url
  end

end
