collection @meetings

attributes :notes, :id, :created_at

child(:action_items) { attributes :id, :description, :due_date, :completed, :user_id }

