class ProjectAttachmentsController < ApplicationController

  def download
    project_attachment = ProjectAttachment.find params[:id]
    send_file project_attachment.document.path, :filename => project_attachment.document.original_filename
  end

end
