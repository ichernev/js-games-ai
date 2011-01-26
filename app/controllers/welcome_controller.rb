class WelcomeController < ApplicationController

  def index
    @name = "indexxx"
  end

  def authenticate_second
    user = params[:user]
    action = 'login_second'
    if User.exists? :email => user['email'] then
      db_user = User.first :conditions => { :email => user['email'] }
      if db_user.valid_password? user['password'] then
        if current_user == db_user then
          msg = 'You can\'t play against yourself! Log someone else in!'
        else
          msg = 'Second user logged in'
          session[:second_user] = db_user
          action = 'index'
        end
      else
        msg = 'Wrong password'
      end
    else
      msg = "No such user, try again"
    end
    flash[:notice] = msg
    redirect_to :action => action 
  end

  def logout_second
    session.delete :second_user
    flash[:notice] = 'You are the only one logged in'
    redirect_to :action => 'index'
  end

end
