module ApplicationHelper

  def side_panel_link(url, icon, text)
  	content_tag :li, class: ('active-tab' if current_page?(url) || @highlight_sidebar == text ) do
  		link_to url, class: 'grey-text' do
  		  fa_icon(icon, text: text)
  		end
  	end
  end

  def from_now(time)
    if time < Time.now
      return "#{distance_of_time_in_words(Time.now, time)} ago".capitalize
    else
      return "In #{distance_of_time_in_words(Time.now, time)}".capitalize
    end
  end

  def application_settings
    ApplicationSetting.find_or_create_by id: 1
  end

end
