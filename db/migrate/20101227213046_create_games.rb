class CreateGames < ActiveRecord::Migration

  def self.up
    create_table :games do |t|
      
      t.string    :name,          :null => false
      t.string    :display_name,  :null => false
      t.text      :description,   :null => false
    end
  end

  def self.down
    drop_table :games
  end

end
