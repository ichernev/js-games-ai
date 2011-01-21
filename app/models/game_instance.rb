class GameInstance < ActiveRecord::Base
  belongs_to :game
  has_many :game_players
  validates_presence_of :game_id, :began
end
