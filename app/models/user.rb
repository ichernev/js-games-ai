class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable and :lockable
  validates_presence_of :name

  devise :database_authenticatable, :registerable, :timeoutable, :validatable

  attr_accessible :email, :name, :password
  belongs_to :game
  has_many :players
  validates_uniqueness_of :email, :name

  def human?
    self.game_id.nil?
  end

  def display_name
    self.human? ? self.name : self.email
  end

end
