class InfoController < ApplicationController
  # Information about all the games on the site.
  def games
    games = (Game.find :all).map { |g| g.attributes }
    render :json => games
  end

  # Users sorted by number of games played, descending.
  def most_games
    options = {
      :select => 'count(*) as field',
      :order => 'field DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by total score.
  def best_total_score
    options = {
      :select => 'sum(players.score) as field',
      :order => 'field DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by best average score.
  def best_avg_score
    options = {
      :select => "to_char(avg(players.score), '9999990.99')  as field",
      :order => 'field DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by time spend playing games, descending.
  def max_time_played
    options = {
      :select => 'sum(instances.duration) as field',
      :order => 'field DESC'
    }

    render_users params[:name], options
  end

  # Users sorted by average time spent playing a game, ascending.
  def fastest_players_avg
    options = {
      :select => "to_char(avg(instances.duration), '9999990.99')  as field",
      :order => 'field ASC'
    }

    render_users params[:name], options
  end

  # ##################################################################

  def render_users game_name, opts
    select = 'users.name, users.email, users.game_id'
    options = {
      :select => select + ', ' + opts[:select],
      :joins => [
        'JOIN players ON players.player_id = users.id',
        'JOIN instances ON players.instance_id = instances.id'
    ],
      :group => select,
      :order => opts[:order]
    }

    if !game_name.nil? then
      game_id = Game.find_by_name(game_name).id
      options[:conditions] = ['instances.game_id = ?', game_id]
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
