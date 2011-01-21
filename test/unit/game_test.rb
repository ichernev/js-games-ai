require 'test_helper'

class GameTest < ActiveSupport::TestCase
  test "name required" do
    g = Game.new
    assert !g.save
  end

  test "save valid game" do
    g = Game.new(:name => "chess")
    assert g.save
  end
end
