collection @klasses

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
  attributes :id, :user_id, :klass_id, :completed

  child :user do
    attributes :id, :full_name, :archive
  end
end
