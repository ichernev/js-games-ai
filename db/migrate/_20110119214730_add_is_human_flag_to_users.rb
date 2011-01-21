class AddIsHumanFlagToUsers < ActiveRecord::Migration
  def self.up
    add_column(:users, :is_human, :boolean, :default => true)
    User.reset_column_information
    User.find(:all).each do |u|
      u.update_attribute :is_human, true
    end
  end

  def self.down
    remove_column(:users, :is_human)
  end
end
