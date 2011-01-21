require 'test_helper'

class GameInstanceTest < ActiveSupport::TestCase
  test "began time required" do
    gi = GameInstance.new
    gi.game = games(:tic_tac_toe)
    assert !gi.save
  end

  test "game id required" do
    gi = GameInstance.new(:began => Time.now)
    assert !gi.save
  end

  test "save valid game instance" do
    gi = GameInstance.new(:began => Time.now)
    gi.game = games(:rocks)
    assert gi.save
  end
end
