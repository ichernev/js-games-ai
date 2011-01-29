require 'test_helper'

class GameTest < ActiveSupport::TestCase

  test "name required" do
    g = Game.new(
      :display_name => 'Chess',
      :description => 'The classic'
    )
    assert !g.save
  end

  test "display name required" do
    g = Game.new(
      :name => 'chess',
      :description => 'The classic'
    )
    assert !g.save
  end

  test "description required" do
    g = Game.new(
      :name => 'chess',
      :display_name => 'Chess'
    )
    assert !g.save
  end

  test "save valid game" do
    g = Game.new(
      :name => 'chess',
      :display_name => 'Chess',
      :description => 'The classic'
    )
    assert g.save
  end

  test "has instances" do
    rocks = games :rocks
    assert_equal rocks.instances.size, 2

    tic = games :tic_tac_toe
    assert_equal tic.instances.size, 1      
  end

  test "has ais" do
    rocks = games :rocks
    assert_equal rocks.ais.size, 1
    assert_equal rocks.ais.first, (users :tripio)

    tic = games :tic_tac_toe
    assert_equal tic.ais.size, 1
    assert_equal tic.ais.first, (users :tic_tac_toe_hard)
  end

  
end
