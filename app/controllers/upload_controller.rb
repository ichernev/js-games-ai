class UploadController < ApplicationController

  def get_game
   result = Package.process params[:package]
   if result then
     flash[:notice] = 'Game package uploaded'
     redirect_to root_path
   else
     flash[:notice] = 'Archive type should be tar'
     redirect_to upload_path
   end
  end

end
