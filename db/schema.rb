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

ActiveRecord::Schema.define(version: 20160215010615) do

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
  end

  add_index "action_items", ["action_id"], name: "index_action_items_on_action_id", using: :btree
  add_index "action_items", ["goal_id"], name: "index_action_items_on_goal_id", using: :btree
  add_index "action_items", ["meeting_id"], name: "index_action_items_on_meeting_id", using: :btree

  create_table "activities", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "activities", ["user_id"], name: "index_activities_on_user_id", using: :btree

  create_table "calendars", force: :cascade do |t|
    t.string   "calendar_id"
    t.boolean  "show"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
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

  create_table "goals", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.boolean  "is_completed"
    t.integer  "progress"
    t.datetime "due_date"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "user_id"
  end

  create_table "klasses", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "weekday"
    t.string   "time"
    t.string   "instructor"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "meetings", force: :cascade do |t|
    t.text     "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
  end

  add_index "meetings", ["user_id"], name: "index_meetings_on_user_id", using: :btree

  create_table "portfolios", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "title"
    t.text     "description"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
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
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
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
  end

  create_table "resources", force: :cascade do |t|
    t.string   "title"
    t.string   "link"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "user_id"
    t.string   "category"
    t.string   "description"
  end

  add_index "resources", ["user_id"], name: "index_resources_on_user_id", using: :btree

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
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.text     "description"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  add_foreign_key "action_items", "goals"
  add_foreign_key "action_items", "meetings"
  add_foreign_key "activities", "users"
  add_foreign_key "enrolls", "klasses"
  add_foreign_key "enrolls", "users"
  add_foreign_key "meetings", "users"
  add_foreign_key "portfolios", "users"
  add_foreign_key "project_attachments", "projects"
  add_foreign_key "resources", "users"
  add_foreign_key "social_media", "users"
  add_foreign_key "tags", "projects"
end
