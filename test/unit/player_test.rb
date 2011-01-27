require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  test "unique player_id per instance_id" do
    one = players(:one)
    gp = Player.new
    gp.player = one.player
    gp.instance_id = one.instance_id
    assert !gp.save
  end

  test "save valid player" do
    gp = Player.new(:play_order => 3)
    gp.instance = players(:five).instance
    gp.player = users(:inna)
    assert_equal gp.score, 0
    assert gp.save
  end
end
