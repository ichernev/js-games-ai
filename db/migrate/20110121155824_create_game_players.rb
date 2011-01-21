class CreateGamePlayers < ActiveRecord::Migration
  def self.up
    create_table :game_players do |t|
      t.references :game_instance
      t.integer :player_id
      t.integer :play_order
      t.integer :score, :default => 0
    end
    add_foreign_key(:game_players, :game_instances)
    add_foreign_key(:game_players, :users, :column => :player_id)
  end

  def self.down
    drop_table :game_players
  end
end
