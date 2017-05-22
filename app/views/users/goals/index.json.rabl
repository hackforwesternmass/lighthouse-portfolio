collection @goals

attributes :id, :title, :description, :is_completed, :progress, :due_date

# node(:due_date) { |goal| goal.due_date_to_iso }
node(:created_at) { |goal| goal.created_at_to_iso }

child(:action_items) { attributes :id, :description, :due_date, :completed }
