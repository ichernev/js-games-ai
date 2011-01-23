require 'json'

class GameController < ApplicationController
  def new
    game = Game.find_by_name params[:name]
    players = JSON request.request_parameters['players']
    gi = GameInstance.init game, players
    render :json => gi.id
  end

  def ai
    us = User.where :game_id => Game.find_by_name(params[:name]).id
    res  = us.map do |u|
      { 'player_id' => u.id,
        'display_name' => u.display_name
      }
    end
    render :json => res
  end

  def play
    instance_id = request.query_parameters['instance_id'].to_i
    # TODO (zori): validate properly
    # assert GameInstance.exists? instance_id
    gi = GameInstance.find instance_id
    game_name = gi.game.name
    players = gi.players
    last_game = last_game_result instance_id, players
    pi = player_info players
    render :json => { 'game_name' => game_name,
      'instance_id' => instance_id,
      'players' => pi,
      'last_game_result' => last_game
    }
  end

  def finish
    game_info = JSON request.request_parameters['game_info']
    instance_id = game_info['instance_id']
    game_result = game_info['game_result']
    result, message = validate instance_id, game_result
    render :json => { 'result' => result,
      'message' => message
    }
  end

  # ##################################################################

  # receives a list of user id's and returns a hash with info on each of them
  def player_info players
    pl = User.find players
    res = {}
    pl.each do |p|
      res[p.id.to_s] = { 'player_id' => p.id,
        'type' => p.type,
        'display_name' => p.display_name
      }
    end
    res
  end

  # returns {player_id => {player_id, play_order, score}, {..}} iff the
  # players played the same game before
  def last_game_result instance_id, players
    instance = GameInstance.find instance_id
    instances = GameInstance.where :game_id => instance.game_id
    filtered = instances.select do |gi|
      gi.finished? and players.sort == gi.players.sort 
    end
    if filtered == [] then
      return
    end
    sorted = filtered.sort_by { |gi| gi.began }
    gp = GamePlayer.where :game_instance_id => sorted.last.id
    res = {}
    gp.each do |p|
      res[p.player_id.to_s] =
        { 'player_id' => p.player_id,
          'play_order' => p.play_order,
          'score' => p.score
        }
    end
    res
  end

  # validates the outcome of a game
  # returns boolean result and message
  def validate instance_id, game_result
    # TODO (zori): validate
    # calculate duration
    # write the result in the database
    [true, 'Game over']
  end
end
