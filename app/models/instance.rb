class Instance < ActiveRecord::Base
  belongs_to :game
  has_many :players, :dependent => :destroy
  validates_presence_of :game_id, :began

  # a classmethod that creates a game instance and registers the corresponding
  # game players in the database
  def self.init game, players
    gi = Instance.new :game => game, :began => Time.now
    players.each do |p|
      # TODO(zori): check validness of player_id
      gp = Player.new :instance => gi,
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
    gp = Player.where :instance_id => self.id
    gp.map { |p| p.player_id }
  end
end
