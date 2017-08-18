object @goals

attributes :id, :title, :description, :is_completed, :progress

node(:due_date) { @goal.due_date_to_iso }
node(:created_at) { @goal.created_at_to_iso }

child(:action_items) { attributes :id, :description, :due_date, :completed }
