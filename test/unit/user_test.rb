require 'test_helper'

class UserTest < ActiveSupport::TestCase

  test "unique email" do
    tripio_email = users(:tripio).email
    u = User.new(
      :name => 'robot',
      :email => tripio_email,
      :password => 'pass'
    )
    assert !u.save
  end

  test "create valid user" do
    u = User.new(
      :name => 'user',
      :email => 'my@email.com',
      :password => 'secret'
    )
    assert u.save
  end

  test "human have nil game_id" do
    u = User.new(
      :name => 'human',
      :email => 'my@mail.com',
      :password => 'passpass'
    )
    assert_nil u.game_id
    assert u.human?
    assert u.save
  end

  test "intelligent agents know their game_id" do
    u = User.new(
      :name => 'bot',
      :email => 'placeholder@google.com',
      :password => 'dummy_pass'
    )
    u.game = games :tic_tac_toe
    assert_not_nil u.game_id
    assert !u.human?
    assert u.save
  end

  test "display name" do
    inna = users :inna
    assert_equal inna.display_name, inna.name
    tripio = users :tripio
    assert_equal tripio.display_name, tripio.name
  end
  
end
