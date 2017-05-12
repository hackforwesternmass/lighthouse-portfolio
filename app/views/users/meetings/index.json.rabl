collection @meetings

attributes :id, :notes, :created_at, :draft

child(:action_items) { attributes :id, :description, :due_date, :completed, :user_id }
