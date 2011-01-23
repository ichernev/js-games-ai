require 'json'

class GameController < ApplicationController
  def new
    game_name = params[:name]
    if Game.exists? :name => game_name then
      game = Game.find_by_name game_name
      players = JSON request.request_parameters['players']
      gi = GameInstance.init game, players
      res = {
        'status' => true,
        'instance_id' => gi.id
      }
    else
      res = {
        'status' => false,
        'message' => 'bad game name'
      }
    end
    render :json => res
  end

  def ai
    game_name = params[:name]
    if Game.exists? :name => game_name then
      game_id = Game.find_by_name(game_name).id
      us = User.where :game_id => game_id 
      ai = us.map do |u|
        {
          'player_id' => u.id,
          'display_name' => u.display_name
        }
      end
      res = {
        'status' => true,
        'ai' => ai
      }
    else
      res = {
        'status' => false,
        'message' => 'bad game name'
      }
    end
    render :json => res
  end

  def play
    instance_id = request.query_parameters['instance_id']
    if instance_id.nil? then
      res = {
        'status' => false,
        'message' => 'expected query parameter "instance_id", got none'
      }
    else
      instance_id = instance_id.to_i
      if GameInstance.exists? instance_id then
        gi = GameInstance.find instance_id
        game_name = gi.game.name
        ps = gi.players
        players = players_info ps
        res = {
          'game_name' => game_name,
          'instance_id' => instance_id,
          'players' => players,
        }
        last_game = last_game_result gi, ps
        res['last_game_result'] = last_game unless last_game.nil?
      else
        res = {
          'status' => false,
          'message' => 'bad instance_id'
        }
      end
    end
    render :json => res
  end

  def finish
    game_info = request.request_parameters['game_info']
    if game_info.nil? then
      message = 'expected request parameter "game_info", got none'
    else
      game_info = JSON game_info
      instance_id = game_info['instance_id']
      game_result = game_info['game_result']
      if instance_id.nil? then
        message = 'no "instance_id" in "game_info"'
      elsif game_result.nil? then
        message = 'no "game_result" in "game_info"'
      else
        if GameInstance.exists? instance_id then
          gi = GameInstance.find instance_id
          gi.duration = Time.now - gi.began
          ps = gi.players.sort
          gr = game_result.map { |p| p['player_id'] }
          if ps == gr.sort then
            game_result.each do |gr|
              p = GamePlayer.find gr['player_id']
              # TODO(zori): validate play order and score
              p.play_order = gr['play_order']
              p.score = gr['score']
              p.save
            end
            message = ''
            gi.save
          else
            message = 'bad player_id\'s'
          end
        else
          message = 'bad instance_id'
        end
      end
    end
    status = message == '' ? true : false
    render :json => {
      'status' => status,
      'message' => message
    }
  end

  # ##################################################################

  # receives a list of user id's and returns a hash with info on each of them
  def players_info players
    pl = User.find players
    res = {}
    pl.each do |p|
      res[p.id.to_s] = {
        'player_id' => p.id,
        'type' => p.type,
        'display_name' => p.display_name
      }
    end
    res
  end

  # returns {player_id => {player_id, play_order, score}, {..}} iff the
  # players played the same game before
  def last_game_result gi, players
    instances = GameInstance.where :game_id => gi.game_id
    players.sort!
    filtered = instances.select do |gi|
      gi.finished? and players == gi.players.sort 
    end
    if filtered == [] then
      return
    end
    sorted = filtered.sort_by { |gi| gi.began }
    gp = GamePlayer.where :game_instance_id => sorted.last.id
    res = {}
    gp.each do |p|
      res[p.player_id.to_s] = {
        'player_id' => p.player_id,
        'play_order' => p.play_order,
        'score' => p.score
      }
    end
    res
  end

end
