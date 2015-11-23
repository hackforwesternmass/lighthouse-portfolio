module ApplicationHelper

  def current_user
    @user = User.find(session[:user_id]) if signed_in?
    @user ||= User.new
  end

  def signed_in?
    session[:user_id].present?
  end

  def side_panel_link(url, icon, text)
  	content_tag :li, class: ("active-tab" if current_page?(url)) do
  		link_to fa_icon(icon, text: text), url, class: "grey-text text-darken-1" 
  	end
  end
end
