class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable and :lockable
  devise :database_authenticatable, :registerable, :timeoutable

  attr_accessible :email, :name, :password
  belongs_to :game
  has_many :game_players
  validates_uniqueness_of :email

  def human?
    self.game_id.nil?
  end

  def display_name
    self.human? ? self.name : self.email
  end

  # "AI", "RemoteUser", "LocalUser"
  def type
    if self.human? then
      # TODO(zori): "RemoteUser"?
      return "LocalUser"
    else
      return "AI"
    end
  end

end
