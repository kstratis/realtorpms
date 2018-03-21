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

ActiveRecord::Schema.define(version: 2018_03_07_191639) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "accounts", force: :cascade do |t|
    t.string "subdomain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "owner_id"
    t.index ["subdomain"], name: "index_accounts_on_subdomain"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "assignments", force: :cascade do |t|
    t.bigint "property_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_assignments_on_property_id"
    t.index ["user_id"], name: "index_assignments_on_user_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "initials"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "continent"
  end

  create_table "invitations", force: :cascade do |t|
    t.string "email"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.index ["account_id"], name: "index_invitations_on_account_id"
    t.index ["token"], name: "index_invitations_on_token"
  end

  create_table "locations", force: :cascade do |t|
    t.integer "area_id"
    t.string "localname"
    t.string "globalname"
    t.integer "level"
    t.integer "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "country_id"
    t.string "parent_localname"
    t.string "parent_globalname"
    t.index ["area_id", "country_id"], name: "index_locations_on_area_id_and_country_id", unique: true
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_memberships_on_account_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "properties", force: :cascade do |t|
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "price"
    t.integer "size"
    t.integer "construction"
    t.integer "renovation"
    t.integer "bedrooms"
    t.integer "bathrooms"
    t.boolean "awnings"
    t.boolean "without_elevator"
    t.boolean "clima"
    t.boolean "security_door"
    t.boolean "pool"
    t.boolean "without_property_charges"
    t.boolean "fit_for_professional_use"
    t.boolean "parking"
    t.boolean "balconies"
    t.boolean "storage_room"
    t.boolean "garden"
    t.integer "orientation"
    t.integer "view"
    t.integer "heating"
    t.boolean "gas"
    t.boolean "solar_heating"
    t.boolean "furnitures"
    t.boolean "fit_for_students"
    t.boolean "fireplace"
    t.integer "user_id"
    t.bigint "account_id"
    t.integer "propertytype"
    t.integer "location_id"
    t.integer "propertycategory"
    t.index ["account_id"], name: "index_properties_on_account_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.integer "age"
    t.string "phone1"
    t.string "phone2"
    t.string "office_branch"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "remember_digest"
    t.boolean "admin", default: false
    t.string "locale"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "assignments", "properties"
  add_foreign_key "assignments", "users"
  add_foreign_key "invitations", "accounts"
  add_foreign_key "locations", "countries"
  add_foreign_key "memberships", "accounts"
  add_foreign_key "memberships", "users"
  add_foreign_key "properties", "accounts"
  add_foreign_key "properties", "locations"
end
