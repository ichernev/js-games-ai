require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "unique email" do
    tripio_email = users(:tripio).email
    u = User.new(:email => tripio_email, :password => "pass")
    assert_raise(ActiveRecord::RecordNotUnique) { u.save }
  end
end
