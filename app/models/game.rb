class Game < ActiveRecord::Base
  attr_accessible :name, :display_name
  has_many :instances
  has_many :players, :class_name => "User"
  validates_presence_of :name
end
