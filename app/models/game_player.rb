class GamePlayer < ActiveRecord::Base
  belongs_to :game_instance
  belongs_to :player, :class_name => "User"
  validates_uniqueness_of :player_id, :scope => :game_instance_id
end
