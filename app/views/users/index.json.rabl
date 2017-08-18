collection @users

attributes :id, :full_name, :meeting_time, :thumb_avatar_url, :archive

child :enrolls do
  attributes :id, :user_id, :klass_id, :completed
end

child :parents => :parents do
  attributes :id, :full_name
end
