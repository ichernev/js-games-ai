class Game < ActiveRecord::Base
  attr_accessible :name, :display_name, :description
  has_many :instances, :dependent => :destroy
  #has_many :players, :through => :instances, :dependent => :delete_all
  # TODO(zori): players -> bots
  #has_many :players, :class_name => "User", :dependent => :delete_all
  has_many :ais, :class_name => "User", :dependent => :destroy
  validates_uniqueness_of :name
  validates_presence_of :name, :display_name, :description
end
