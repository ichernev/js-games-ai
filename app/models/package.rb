require 'archive/tar/minitar'
require 'json'

include Archive::Tar

class Package < ActiveRecord::Base

  @@tmp = '/tmp'
  @@dir = 'public/games'
  @@meta_file = 'meta.json'

  def self.process package
    # IE gives names of uploaded files strangely. Need to be sanitized.
    name = package.original_filename
    content_type = package.content_type
    if content_type != 'application/x-tar' then
      return false
    end
    tmp_path = File.join @@tmp, name
    dir_path = File.join @@dir, File.basename(name, File.extname(name))
    File.open tmp_path, 'wb' do |f|
      f.write package.read
      Minitar.unpack(tmp_path, dir_path)
    end
    # Read game data from meta file
    begin
      meta = File.join dir_path, @@meta_file
      game_data = ''
      File.open meta, 'r' do |f|
        game_data = f.read
      end
      game = Game.new (JSON game_data)
      return game.save
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
