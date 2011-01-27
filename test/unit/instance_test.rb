require 'test_helper'

class InstanceTest < ActiveSupport::TestCase
  test "began time required" do
    gi = Instance.new
    gi.game = games :tic_tac_toe 
    assert !gi.save
  end

  test "game id required" do
    gi = Instance.new :began => Time.now
    assert !gi.save
  end

  test "save valid game instance" do
    gi = Instance.new :began => Time.now 
    gi.game = games :rocks 
    assert gi.save
  end

  test "unfinished game" do
    gi = Instance.new :began => Time.now
    gi.game = games :tic_tac_toe 
    assert gi.save
    assert !gi.finished?
  end

  test "finished game" do
    gi = Instance.new :began => 5.day.ago
    gi.duration = Time.now - gi.began
    gi.game = games :rocks
    assert gi.save
  end

  test "correct players returned" do
    game = games :rocks
    players = users :pesho, :mark, :tripio
    players.map! { |p| p.id }
    gi = Instance.init game, players
    assert_equal players.size, 3
    gip = gi.players
    assert_equal gip.size, 3
    assert_equal players.sort, gip.sort
  end
end
