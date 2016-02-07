collection @goals

attributes :id, :title, :description, :due_date, :is_completed, :created_at, :progress

child(:action_items) { attributes :id, :description, :due_date, :completed }


