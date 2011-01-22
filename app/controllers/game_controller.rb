require 'json'

class GameController < ApplicationController
  def new
    game = Game.find_by_name params[:name]
    players = JSON request.request_parameters['players']
    gi = GameInstance.init game, players
    render :json => gi.id
  end

  def ai
    us = User.find :all,
                   :conditions =>
                        {:game_id => Game.find_by_name(params[:name]).id},
                   :select => "id, email"
    x = us.map do |u|
      {:player_id => u.id, :display_name => u.display_name}
    end
    render :json => x
  end

  def play
    game_instance_id = request.query_parameters['game_instance_id'].to_i
    # TODO (zori): validate properly
    # assert GameInstance.exists? game_instance_id
    gi = GameInstance.find game_instance_id
    game_name = gi.game.name
    players = gi.players
    last_game = last_game_result game_instance_id, players
    render :json => {'game_name' => game_name,
        'instance_id' => game_instance_id,
        'players' => players,
        'last_game_result' => last_game}
  end

  def finish
    game_info = JSON request.request_parameters['game_info']
    game_instance_id = game_info['game_instance_id']
    game_result = game_info['game_result']
    result, message = validate game_instance_id, game_result
    render :json => {'result' => result, 'message' => message}
  end

  # returns [{player_id, play_order, score}, {..}] if the same players played
  # the same game before or "undefined" otherwise
  def last_game_result game_instance_id, players
    instances = GameInstance.find :all,
                                  :conditions => {:game_id => GameInstance.find(game_instance_id).game_id}
    filtered = instances.select do |gi|
      gi.finished? and players.sort == gi.players.sort 
    end
    if filtered == [] then
      return "undefined"
    end
    sorted = filtered.sort_by { |gi| gi.began }
    last = sorted.last
    gp = GamePlayer.where :game_instance_id => last.id
    gp.map do |p|
      {"player_id" => p.player_id, "play_order" => p.play_order, "score" => p.score}
    end
  end

  # validates the outcome of a game
  # returns boolean result and message
  def validate game_instance_id, game_result
    # TODO (zori): validate
    # write the result in the database
    [true, "Game over"]
  end
end
