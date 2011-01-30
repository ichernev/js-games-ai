require 'archive/tar/minitar'
require 'json'

include Archive::Tar

class Package < ActiveRecord::Base

  @@tmp = '/tmp'
  @@dir = 'public/games'
  @@meta = 'meta.json'

  def self.process package
    # IE gives names of uploaded files strangely. Need to be sanitized.
    name = package.original_filename
    content_type = package.content_type
    if content_type != 'application/x-tar' then
      return false
    end
    begin
      # Unpack archive
      tmp_path = File.join @@tmp, name
      File.open(tmp_path, 'wb') { |f| f.write package.read }
      Minitar.unpack(tmp_path, @@dir)

      # basename, like 'Rocks'
      basename = File.basename(name, File.extname(name))
      # game dir, like 'public/games/Rocks'
      game_dir = File.join @@dir, basename

      # Generate .css from .sass files
      # public/games/Rocks/sass/.. -> public/games/Rocks/css/..
      sass = File.join game_dir, 'sass'
      css = File.join game_dir, 'css'
      system "sass --update #{sass}:#{css}"

      # Read game data from meta file
      meta_file = File.join game_dir, @@meta
      game_data = ''
      File.open(meta_file, 'r') { |f| game_data = f.read }
      game_data = JSON game_data
 
      # Create and save the new game, if unique
      res = false
      game = Game.find_by_name basename
      if game.nil? then
        game = Game.new game_data
        res = game.save
      else
        res = game.update_attributes game_data
      end

      # Create one AI for the game
      ai_res = true
      ai = User.find(
        :first,
        :conditions => {
          :game_id => game.id
      })
      if ai.nil? then
        ai = User.new(
          :email => (basename + 'Computer'),
          :name => basename,
          :password => basename
        )
        ai.game = game
        ai_res = ai.save
      end
      return (res and ai_res)
    rescue
      return false
    end
  end

  # Delete a file from rails root.
  def delete_file name
    filename = "#{RAILS_ROOT}/#{@@dir}/#{name}" 
    File.delete filename if File.exists? filename
  end

end
