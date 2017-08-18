object @klass

attributes  :id,
            :description,
            :time,
            :name,
            :instructor,
            :created_at,
            :google_drive_url,
            :weekdays,
            :seasons,
            :years,
            :instructor_email,
            :instructor_phone,
            :one_on_one,
            :location,
            :archive

child :enrolls do
  attributes :id, :user_id, :klass_id
end

child :users do |user|
  attributes :id, :full_name, :archive
end
