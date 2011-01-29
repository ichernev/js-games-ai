class Player < ActiveRecord::Base
  belongs_to :instance
  # TODO(zori): player -> user
  # belongs_to :player, :class_name => "User"
  belongs_to :user
  validates_uniqueness_of :user_id, :scope => :instance_id
end
