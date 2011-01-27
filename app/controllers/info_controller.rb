class InfoController < ApplicationController
  # Information about all the games on the site.
  def games
    games = (Game.find :all).map { |g| g.attributes }
    render :json => games
  end

  # Users sorted by number of games played, descending.
  def most_games
    options = {
      :select => 'count(*) as num_games',
      :order => 'num_games DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by total score.
  def best_total_score
    options = {
      :select => 'sum(players.score) as total_score',
      :order => 'total_score DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by best average score.
  def best_avg_score
    options = {
      :select => 'avg(players.score) as avg_score',
      :order => 'avg_score DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by time spend playing games, descending.
  def max_time_played
    options = {
      :select => 'sum(game_instances.duration) as total_time',
      :order => 'total_time DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by average time spent playing a game, ascending.
  def fastest_players_avg
    options = {
      :select => 'avg(game_instances.duration) as avg_time',
      :order => 'avg_time ASC'
    }

    render_users params[:name], options
  end

  # ##################################################################

  def render_users game_name, opts
    options = {
      :select => 'users.id, users.name, users.email, users.game_id, ' + opts[:select],
      :joins => [
        'JOIN players ON players.player_id = users.id',
        'JOIN game_instances ON players.game_instance_id = game_instances.id'
    ],
      :group => 'users.id, users.name, users.email, users.game_id',
      :order => opts[:order]
    }

    if !game_name.nil? then
      game_id = Game.find_by_name(game_name).id
      options[:conditions] = ['game_instances.game_id = ?', game_id]
    end

    users = User.find :all, options
    users.map! do |u|
      attrs = u.attributes
      attrs[:display_name] = u.display_name
      attrs.delete 'name'
      attrs.delete 'email'
      attrs.delete 'game_id'
      attrs
    end
    render :json => users
  end
  
end
