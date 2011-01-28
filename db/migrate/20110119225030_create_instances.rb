class CreateInstances < ActiveRecord::Migration
  def self.up
    create_table :instances do |t|
      t.references :game

      t.datetime :began, :null => false
      t.integer :duration, :default => 0
    end

    add_foreign_key :instances, :games
  end

  def self.down
    drop_table :instances
  end
end
