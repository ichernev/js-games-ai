require 'test_helper'

class GamePlayerTest < ActiveSupport::TestCase
  test "unique play_order per game_instance_id" do
    #u = User.new(:email => "foo@bar")
    three = game_players(:three)
    gp = GamePlayer.new(:play_order => three.play_order)
    gp.game_instance = three.game_instance
    assert !gp.save
  end

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
    assert_equal 0, gp.score 
    assert gp.save
  end
end
