class Player < ActiveRecord::Base

  belongs_to :instance
  belongs_to :user

  validates_uniqueness_of :user_id, :scope => :instance_id
  
end
