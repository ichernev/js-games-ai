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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110121155824) do

  create_table "game_instances", :force => true do |t|
    t.integer "game_id"
    t.date    "begin"
    t.integer "duration"
  end

  create_table "game_players", :force => true do |t|
    t.integer "game_instance_id"
    t.integer "player_id"
    t.integer "play_order"
    t.integer "score"
  end

  create_table "games", :force => true do |t|
    t.string "name"
    t.string "display_name"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                             :default => "",   :null => false
    t.string   "encrypted_password", :limit => 128, :default => "",   :null => false
    t.string   "password_salt",                     :default => "",   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_human",                          :default => true
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true

  add_foreign_key "game_instances", "games", :name => "game_instances_game_id_fk"

  add_foreign_key "game_players", "game_instances", :name => "game_players_game_instance_id_fk"
  add_foreign_key "game_players", "users", :name => "game_players_player_id_fk", :column => "player_id"

end
