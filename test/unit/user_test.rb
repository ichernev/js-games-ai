require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "unique email" do
    tripio_email = users(:tripio).email
    u = User.new(:email => tripio_email, :password => "pass")
    assert_raise(ActiveRecord::RecordNotUnique) { u.save }
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

  test "AI type" do
    u = users :tripio
    assert !u.human?
    assert_equal "AI", u.type
  end

  test "LocalUser type" do
    u = users :inna
    assert u.human?
    assert_equal "LocalUser", u.type
  end
end
