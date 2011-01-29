class AdminController < ApplicationController

  def delete_game
    name = params[:name]
    doomed_game = Game.find_by_name name
    if doomed_game.nil? then
      flash[:notice] = "No game with name #{name} in database"
    else
      flash[:notice] = "Game #{name} was removed"
      doomed_game.destroy
    end
    redirect_to root_path
  end

end
