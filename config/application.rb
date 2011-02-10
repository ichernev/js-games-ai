require File.expand_path('../boot', __FILE__)

require 'rails/all'

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env) if defined?(Bundler)

module JsGames
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # JavaScript files you want as :defaults (application.js is always included).
    config.action_view.javascript_expansions[:defaults] = []
    config.action_view.javascript_expansions[:lib] = [
      'lib/jquery-1.4.4.js',
      'rails.js',  # this is a jquery rails adapter.
      'lib/jquery.log.js',

      'lib/jquery-ui-1.8.9.custom.min.js'
    ]
    config.action_view.javascript_expansions[:src] = [
      'src/init.js',
      'src/util.js',
      'src/event.js',
      'src/html.js',

      'src/main_ui.js',
      'src/game_list.js',
      'src/statistics.js',
      'src/widgets/ma3x.js',
      
      'src/start_game.js',
      'src/game_manager.js',
      'src/play_manager.js',
      'src/base_game.js',
      'src/local_user.js',
      'src/remote_gateway.js',

      'src/finish_init.js',
      # 'src/game_test.js',

      '../games/Nim/js/game.js',
      '../games/Nim/js/board.js',
      '../games/Nim/js/board_ui.js',
      '../games/Nim/js/perfect_ai.js'

      # 'src/games/Rocks/game.js',
      # 'src/games/Rocks/perfect_ai.js',
      # 'src/games/Rocks/board.js',
      # 'src/games/Rocks/board_ui.js'
    ]
    config.action_view.javascript_expansions[:test] = [
      'src/pre.test.js',
      'src/util.test.js',
      'src/html.test.js',
      'src/widgets/ma3x.test.js',
      'src/post.test.js'
    ]

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]
  end
end
