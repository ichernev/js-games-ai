class UploadController < ApplicationController

  def get_game
   Package.process params[:package]
   render :text => 'Game package uploaded'
  end

end
