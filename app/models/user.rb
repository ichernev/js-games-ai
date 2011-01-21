class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable and :lockable
  devise :database_authenticatable, :registerable, :timeoutable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password
  has_many :game_players
end
