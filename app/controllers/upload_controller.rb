class UploadController < ApplicationController

  def get_game
   result = Package.process params[:package]
   if result then
     flash[:notice] = 'Game package uploaded'
     redirect_to root_path
   else
     flash[:notice] = 'Archive should be tar (`tar -cvf test.tar meta.json`) containing a file meta.json with the game description'
     redirect_to upload_path
   end
  end

end
