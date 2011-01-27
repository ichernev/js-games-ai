require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  test "unique player_id per game_instance_id" do
    one = players(:one)
    gp = Player.new
    gp.player = one.player
    gp.game_instance_id = one.game_instance_id
    assert !gp.save
  end

  test "save valid player" do
    gp = Player.new(:play_order => 3)
    gp.game_instance = players(:five).game_instance
    gp.player = users(:inna)
    assert_equal gp.score, 0
    assert gp.save
  end
end
