module ApplicationHelper

  def current_user
    @user = User.find(session[:user_id]) if signed_in?
    @user ||= User.new
  end

  def signed_in?
    session[:user_id].present?
  end

  def side_panel_link(url, icon, text)
  	content_tag :li, class: ("active-tab" if current_page?(url) || @highlight_sidebar == text ) do
  		link_to fa_icon(icon, text: text), url, class: "grey-text text-darken-1" 
  	end
  end

  def from_now(time)
    if time < Time.now
      str = "#{distance_of_time_in_words(Time.now, time)} ago".capitalize
    else
      str = "In #{distance_of_time_in_words(Time.now, time)}".capitalize
    end
    return str
  end
  
end
