object @meeting

attributes :id, :notes, :created_at

child(:action_items) { attributes :id, :description, :due_date, :completed, :user_id }
