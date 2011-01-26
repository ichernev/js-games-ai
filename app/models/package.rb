class Package < ActiveRecord::Base

  @@dir = 'public/data'

  def self.process package
    # IE gives names of uploaded files strangely. Need to be sanitized.
    name = package.original_filename
    #content = package.content_type
    path = File.join @@dir, name
    File.open path, 'wb' do |f|
      # TODO(zori): Rather than that, just unarchive and clean-up
      f.write package.read
    end
  end

  def delete_file name
    filename = "#{RAILS_ROOT}/#{@@dir}/#{name}" 
    File.delete filename if File.exists? filename
  end

end
