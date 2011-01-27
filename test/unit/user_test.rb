require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "unique email" do
    tripio_email = users(:tripio).email
    u = User.new(:email => tripio_email, :password => "pass")
    assert !u.save
  end

  test "human have nil game_id" do
    u = User.new(:email => "my@mail.com", :password => "pass")
    assert_nil u.game_id
    assert u.human?
    assert u.save
  end

  test "intelligent agents know their game_id" do
    u = User.new(:email => "placeholder", :password => "dummy_pass")
    u.game = games(:tic_tac_toe)
    assert_not_nil u.game_id
    assert !u.human?
    assert u.save
  end

  test "display name" do
    inna = users :inna
    assert_equal inna.display_name, inna.name
    tripio = users :tripio
    assert_equal tripio.display_name, tripio.email
  end
end
