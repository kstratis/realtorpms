class UsersController < ApplicationController
  layout 'registration/main', except: [:show]  # show the barebones version only when signing up
  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id]) # Automatically converts parameters from string to integer
  end
end
