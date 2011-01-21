class GamePlayer < ActiveRecord::Base
  belongs_to :game_instance
  belongs_to :player, :class_name => "User"
end
