require 'test_helper'

class GameInstanceTest < ActiveSupport::TestCase
  test "began time required" do
    gi = GameInstance.new
    gi.game = games :tic_tac_toe 
    assert !gi.save
  end

  test "game id required" do
    gi = GameInstance.new :began => Time.now
    assert !gi.save
  end

  test "save valid game instance" do
    gi = GameInstance.new :began => Time.now 
    gi.game = games :rocks 
    assert gi.save
  end

  test "unfinished game" do
    gi = GameInstance.new :began => Time.now
    gi.game = games :tic_tac_toe 
    assert gi.save
    assert !gi.finished?
  end

  test "finished game" do
    gi = GameInstance.new :began => 5.day.ago
    gi.duration = Time.now - gi.began
    gi.game = games :rocks
    assert gi.save
  end

  test "correct players returned" do
    game = games :rocks
    players = users :pesho, :mark, :tripio
    players.map! { |p| p.id }
    gi = GameInstance.init game, players
    assert_equal players.size, 3
    gip = gi.players
    assert_equal gip.size, 3
    assert_equal players.sort, gip.sort
  end
end
