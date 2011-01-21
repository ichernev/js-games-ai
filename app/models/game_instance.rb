class GameInstance < ActiveRecord::Base
  belongs_to :game
  has_many :game_players
end
