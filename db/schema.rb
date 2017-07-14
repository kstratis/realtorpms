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

ActiveRecord::Schema.define(version: 20170714190748) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "properties", force: :cascade do |t|
    t.text "description"
    t.integer "user_id"
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
    t.integer "type"
    t.integer "orientation"
    t.integer "view"
    t.integer "heating"
    t.boolean "gas"
    t.boolean "solar_heating"
    t.boolean "furnitures"
    t.boolean "fit_for_students"
    t.boolean "fireplace"
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
  end

end
