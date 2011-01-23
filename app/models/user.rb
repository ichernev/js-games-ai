class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable and :lockable
  devise :database_authenticatable, :registerable, :timeoutable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password
  belongs_to :game
  has_many :game_players

  def human?
    self.game_id.nil?
  end

  def display_name
    self.email
  end

  # "AI", "RemoteUser", "LocalUser"
  def type
    if self.human? then
      # TODO (zori)
      return "LocalUser"
    else
      return "AI"
    end
  end
end
