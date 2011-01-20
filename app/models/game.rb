class Game < ActiveRecord::Base
  attr_accessible :name, :display_name

  has_many :game_instances
end
