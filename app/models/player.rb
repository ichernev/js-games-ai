class Player < ActiveRecord::Base
  belongs_to :instance
  belongs_to :player, :class_name => "User"
  validates_uniqueness_of :player_id, :scope => :instance_id
end
