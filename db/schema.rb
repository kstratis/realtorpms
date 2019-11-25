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

ActiveRecord::Schema.define(version: 2019_11_24_234731) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "accounts", force: :cascade do |t|
    t.string "subdomain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "telephones"
    t.string "address"
    t.string "email"
    t.string "website"
    t.bigint "owner_id"
    t.index ["owner_id"], name: "index_accounts_on_owner_id"
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

  create_table "categories", force: :cascade do |t|
    t.string "localname"
    t.string "globalname"
    t.integer "level"
    t.integer "parent_id"
    t.string "parent_localname"
    t.string "parent_globalname"
    t.string "slug"
    t.string "parent_slug"
  end

  create_table "clients", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "telephones"
    t.string "job"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.text "searchprefs"
    t.text "color"
    t.jsonb "preferences", default: {}, null: false
    t.integer "model_type_id"
    t.boolean "brokerlistingagreement", default: false
    t.boolean "buyerbrokeragreement", default: false
    t.index ["account_id"], name: "index_clients_on_account_id"
    t.index ["last_name"], name: "index_clients_on_last_name"
  end

  create_table "clientships", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "client_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_clientships_on_client_id"
    t.index ["user_id"], name: "index_clientships_on_user_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "initials"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "continent"
  end

  create_table "cpas", force: :cascade do |t|
    t.bigint "client_id"
    t.bigint "property_id"
    t.boolean "ownership", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_cpas_on_client_id"
    t.index ["property_id"], name: "index_cpas_on_property_id"
  end

  create_table "entity_fields", force: :cascade do |t|
    t.string "name"
    t.string "field_type"
    t.boolean "required"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "model_type_id"
    t.string "options"
    t.string "slug"
    t.index ["model_type_id"], name: "index_entity_fields_on_model_type_id"
  end

  create_table "extras", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "subtype"
  end

  create_table "extras_properties", id: false, force: :cascade do |t|
    t.bigint "extra_id", null: false
    t.bigint "property_id", null: false
  end

  create_table "favlists", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.bigint "account_id"
    t.index ["account_id"], name: "index_favlists_on_account_id"
    t.index ["user_id"], name: "index_favlists_on_user_id"
  end

  create_table "favlists_properties", id: false, force: :cascade do |t|
    t.bigint "favlist_id"
    t.bigint "property_id"
    t.index ["favlist_id", "property_id"], name: "index_favlists_properties_on_favlist_id_and_property_id", unique: true
    t.index ["favlist_id"], name: "index_favlists_properties_on_favlist_id"
    t.index ["property_id", "favlist_id"], name: "index_favlists_properties_on_property_id_and_favlist_id", unique: true
    t.index ["property_id"], name: "index_favlists_properties_on_property_id"
  end

  create_table "favorites", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "property_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_favorites_on_property_id"
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.string "email"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.index ["account_id"], name: "index_invitations_on_account_id"
    t.index ["email", "account_id"], name: "index_invitations_on_email_and_account_id", unique: true
    t.index ["token"], name: "index_invitations_on_token"
  end

  create_table "landlords", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "telephones"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string "localname"
    t.string "globalname"
    t.integer "level"
    t.integer "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "country_id"
    t.string "parent_localname"
    t.string "parent_globalname"
    t.index ["id", "country_id"], name: "index_locations_on_id_and_country_id"
  end

  create_table "logs", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "property_id"
    t.bigint "client_id"
    t.string "action"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "property_name"
    t.string "user_name"
    t.string "client_name"
    t.bigint "account_id"
    t.bigint "author_id"
    t.string "author_name"
    t.string "account_name"
    t.string "entity"
    t.index ["account_id"], name: "index_logs_on_account_id"
    t.index ["author_id"], name: "index_logs_on_author_id"
    t.index ["client_id"], name: "index_logs_on_client_id"
    t.index ["property_id"], name: "index_logs_on_property_id"
    t.index ["user_id"], name: "index_logs_on_user_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active", default: true
    t.index ["account_id", "user_id"], name: "index_memberships_on_account_id_and_user_id", unique: true
    t.index ["account_id"], name: "index_memberships_on_account_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "model_types", force: :cascade do |t|
    t.string "name"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_model_types_on_account_id"
  end

  create_table "model_types_users", force: :cascade do |t|
    t.bigint "model_type_id"
    t.bigint "user_id"
    t.index ["model_type_id"], name: "index_model_types_users_on_model_type_id"
    t.index ["user_id"], name: "index_model_types_users_on_user_id"
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
    t.bigint "account_id"
    t.integer "businesstype"
    t.integer "floor"
    t.integer "levels"
    t.datetime "availability"
    t.bigint "location_id"
    t.string "title"
    t.string "roofdeck_space"
    t.string "storage_space"
    t.string "garden_space"
    t.string "plot_space"
    t.string "notes"
    t.string "adxe"
    t.string "adspitogatos"
    t.string "address"
    t.integer "favorites_count"
    t.string "map_url"
    t.bigint "category_id"
    t.string "slug"
    t.integer "model_type_id"
    t.jsonb "preferences", default: {}, null: false
    t.index ["account_id"], name: "index_properties_on_account_id"
    t.index ["category_id"], name: "index_properties_on_category_id"
    t.index ["location_id"], name: "index_properties_on_location_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone1"
    t.string "phone2"
    t.string "office_branch"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_digest"
    t.string "locale"
    t.string "password_digest"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.date "dob"
    t.string "color"
    t.string "time_zone", default: "UTC"
    t.jsonb "preferences", default: {}, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "accounts", "users", column: "owner_id"
  add_foreign_key "assignments", "properties"
  add_foreign_key "assignments", "users"
  add_foreign_key "clients", "accounts"
  add_foreign_key "clientships", "clients"
  add_foreign_key "clientships", "users"
  add_foreign_key "favlists", "accounts"
  add_foreign_key "favlists", "users"
  add_foreign_key "favorites", "properties"
  add_foreign_key "favorites", "users"
  add_foreign_key "invitations", "accounts"
  add_foreign_key "locations", "countries"
  add_foreign_key "logs", "accounts"
  add_foreign_key "logs", "clients"
  add_foreign_key "logs", "properties"
  add_foreign_key "logs", "users"
  add_foreign_key "logs", "users", column: "author_id"
  add_foreign_key "memberships", "accounts"
  add_foreign_key "memberships", "users"
  add_foreign_key "model_types", "accounts"
  add_foreign_key "properties", "accounts"
  add_foreign_key "properties", "categories"
  add_foreign_key "properties", "locations"
end
