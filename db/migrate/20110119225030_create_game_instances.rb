class CreateGameInstances < ActiveRecord::Migration
  def self.up
    create_table :game_instances do |t|
      t.references :game

      t.datetime :began, :null => false
      t.integer :duration, :default => 0
    end

    add_foreign_key(:game_instances, :games)
  end

  def self.down
    drop_table :game_instances
  end
end
