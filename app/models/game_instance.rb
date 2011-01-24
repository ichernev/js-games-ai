class GameInstance < ActiveRecord::Base
  belongs_to :game
  has_many :game_players
  validates_presence_of :game_id, :began

  # a classmethod that creates a game instance and registers the corresponding
  # game players in the database
  def self.init game, players
    gi = GameInstance.new :began => Time.now
    gi.game = game
    players.each do |p|
      # TODO(zori): check validness of player_id
      gp = GamePlayer.new :game_instance => gi,
                          :player_id => p
      gp.save
    end
    gi.save
    gi
  end

  def finished?
    self.duration != 0
  end

  # returns a list of ids of the users playing this instance
  def players
    gp = GamePlayer.where :game_instance_id => self.id
    gp.collect { |p| p.player_id }
  end
end
