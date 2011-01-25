require 'test_helper'

class GamePlayerTest < ActiveSupport::TestCase
  test "unique player_id per game_instance_id" do
    one = game_players(:one)
    gp = GamePlayer.new
    gp.player = one.player
    gp.game_instance_id = one.game_instance_id
    assert !gp.save
  end

  test "save valid game_player" do
    gp = GamePlayer.new(:play_order => 3)
    gp.game_instance = game_players(:five).game_instance
    gp.player = users(:inna)
    assert_equal gp.score, 0
    assert gp.save
  end
end
