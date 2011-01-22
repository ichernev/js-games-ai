class GameInstance < ActiveRecord::Base
  belongs_to :game
  has_many :game_players
  validates_presence_of :game_id, :began

  def finished?
    self.duration != 0
  end

  def self.init game, players
    gi = GameInstance.new :began => Time.now
    gi.game = game
    players.each_with_index do |p, i|
      # TODO (zori): who assigns play order
      # check validness of player_id
      gp = GamePlayer.new :game_instance => gi,
                          :player_id => p,
                          :play_order => i + 1
      gp.save
    end
    gi.save
    gi
  end

  # returns a list of ids of the users playing this instance
  def players
    gp = GamePlayer.find :all,
                         :conditions => {:game_instance_id => self.id}
    gp.map do |p|
      p.player_id
    end
  end
end
