class TestController < ApplicationController

  def qunit_test
    render :layout => false
  end

  def game_test
    render
  end

end
