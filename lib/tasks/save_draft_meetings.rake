desc 'This task saves all draft meetings as completed meetings in the system'
task :save_draft_meetings => :environment do
  all_draft_meetings = Meeting.where(draft: true)
  all_draft_meetings.update_all(draft: false)
end
