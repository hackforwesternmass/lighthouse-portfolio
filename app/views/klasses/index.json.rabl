collection @klasses

attributes  :id,
            :description,
            :weekday,
            :time,
            :name,
            :instructor,
            :created_at,
            :google_drive_url,
            :season,
            :year,
            :instructor_email,
            :instructor_phone,
            :one_on_one,
            :location,
            :enrolled_count

child :enrolls do
  attributes :id, :user_id, :klass_id
end

child :users do |user|
  attributes :id, :full_name
end
