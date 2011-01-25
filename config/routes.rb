JsGames::Application.routes.draw do
  devise_for :users

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # tests
  match 'test' => 'test#qunit_test'
  match 'gametest' => 'test#game_test'
  match 'uitest' => 'test#ui_test'

  # game controller
  match 'game/:name/ai.json' => 'game#ai'
  match 'game/:name/new.json' => 'game#new'
  match 'game/play.json' => 'game#play'
  match 'game/finish.json' => 'game#finish'

  # info
  match 'info/games.json' => 'info#games'

  # statistics
  match 'stats/most_games.json' => 'info#most_games'
  match 'stats/:name/most_games.json' => 'info#most_games'

  match 'stats/best_total_score.json' => 'info#best_total_score'
  match 'stats/:name/best_total_score.json' => 'info#best_total_score'

  match 'stats/best_avg_score.json' => 'info#best_avg_score'
  match 'stats/:name/best_avg_score.json' => 'info#best_avg_score'

  match 'stats/max_time_played.json' => 'info#max_time_played'
  match 'stats/:name/max_time_played.json' => 'info#max_time_played'

  match 'stats/fastest_players_avg.json' => 'info#fastest_players_avg'
  match 'stats/:name/fastest_players_avg.json' => 'info#fastest_players_avg'

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
