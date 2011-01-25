class DeviseCreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.references :game, :default => nil
      t.database_authenticatable :null => false
      t.string :name
    end

    add_index :users, :email, :unique => true
    add_foreign_key :users, :games
  end

  def self.down
    drop_table :users
  end
end
