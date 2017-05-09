# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170508155915) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_items", force: :cascade do |t|
    t.date     "due_date"
    t.boolean  "completed"
    t.text     "description"
    t.integer  "action_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "meeting_id"
    t.integer  "goal_id"
    t.integer  "user_id"
    t.boolean  "archive"
  end

  add_index "action_items", ["action_id"], name: "index_action_items_on_action_id", using: :btree
  add_index "action_items", ["goal_id"], name: "index_action_items_on_goal_id", using: :btree
  add_index "action_items", ["meeting_id"], name: "index_action_items_on_meeting_id", using: :btree
  add_index "action_items", ["user_id"], name: "index_action_items_on_user_id", using: :btree

  create_table "background_images", force: :cascade do |t|
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "calendars", force: :cascade do |t|
    t.string   "calendar_id"
    t.boolean  "show"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.boolean  "hide_week_view"
    t.string   "calendar_url"
  end

  create_table "class_periods", force: :cascade do |t|
    t.string   "start_time"
    t.string   "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "enrolls", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "klass_id"
    t.boolean  "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "enrolls", ["klass_id"], name: "index_enrolls_on_klass_id", using: :btree
  add_index "enrolls", ["user_id"], name: "index_enrolls_on_user_id", using: :btree

  create_table "feedbacks", force: :cascade do |t|
    t.string   "name"
    t.string   "subject"
    t.text     "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "goals", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.boolean  "is_completed", default: false
    t.integer  "progress"
    t.datetime "due_date"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "user_id"
  end

  create_table "klasses", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "weekday"
    t.string   "time"
    t.string   "instructor"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "google_drive_url"
    t.string   "season"
    t.string   "year"
    t.string   "instructor_email"
    t.string   "instructor_phone"
    t.boolean  "one_on_one"
    t.string   "location"
  end

  create_table "meetings", force: :cascade do |t|
    t.text     "notes"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "user_id"
    t.boolean  "draft",      default: false
  end

  add_index "meetings", ["user_id"], name: "index_meetings_on_user_id", using: :btree

  create_table "parents", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "parents", ["user_id"], name: "index_parents_on_user_id", using: :btree

  create_table "portfolios", force: :cascade do |t|
    t.text     "description"
    t.string   "color"
    t.boolean  "private"
    t.string   "background_file_name"
    t.string   "background_content_type"
    t.integer  "background_file_size"
    t.datetime "background_updated_at"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.integer  "user_id"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "portfolios", ["user_id"], name: "index_portfolios_on_user_id", using: :btree

  create_table "project_attachments", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "document_file_name"
    t.string   "document_content_type"
    t.integer  "document_file_size"
    t.datetime "document_updated_at"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "project_attachments", ["project_id"], name: "index_project_attachments_on_project_id", using: :btree

  create_table "projects", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.text     "resume"
    t.integer  "difficulty"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.integer  "user_id"
    t.string   "link"
    t.date     "date_completed"
    t.string   "location"
    t.time     "time_spent"
    t.text     "body"
    t.boolean  "priority"
    t.string   "document_file_name"
    t.string   "document_content_type"
    t.integer  "document_file_size"
    t.datetime "document_updated_at"
  end

  create_table "resources", force: :cascade do |t|
    t.string   "title"
    t.string   "link"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "user_id"
    t.string   "category"
    t.string   "description"
    t.boolean  "general"
  end

  add_index "resources", ["user_id"], name: "index_resources_on_user_id", using: :btree

  create_table "resume_entries", force: :cascade do |t|
    t.string   "title"
    t.string   "subtitle"
    t.string   "date"
    t.text     "description"
    t.integer  "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "resume_entries", ["user_id"], name: "index_resume_entries_on_user_id", using: :btree

  create_table "social_media", force: :cascade do |t|
    t.string   "link"
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "icon"
  end

  add_index "social_media", ["user_id"], name: "index_social_media_on_user_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tags", ["project_id"], name: "index_tags_on_project_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "username"
    t.string   "email"
    t.string   "password"
    t.string   "role"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.text     "description"
    t.string   "meeting_time"
    t.string   "profile_background_file_name"
    t.string   "profile_background_content_type"
    t.integer  "profile_background_file_size"
    t.datetime "profile_background_updated_at"
    t.string   "profile_color"
    t.boolean  "private"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  add_foreign_key "action_items", "goals"
  add_foreign_key "action_items", "meetings"
  add_foreign_key "action_items", "users"
  add_foreign_key "enrolls", "klasses"
  add_foreign_key "enrolls", "users"
  add_foreign_key "meetings", "users"
  add_foreign_key "parents", "users"
  add_foreign_key "portfolios", "users"
  add_foreign_key "project_attachments", "projects"
  add_foreign_key "resources", "users"
  add_foreign_key "resume_entries", "users"
  add_foreign_key "social_media", "users"
  add_foreign_key "tags", "projects"
end
