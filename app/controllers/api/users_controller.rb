module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render json: { success: true, user: @user.as_json(only: [:id, :username, :email]) }, status: :created
      else
        render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      @user = User.find_by(username: params[:id])
      if @user
        render json: {
          username: @user.username,
          tweets: @user.tweets,
          following_count: @user.following_count || 0,
          followers_count: @user.followers_count || 0,
        }
      else
        render json: { error: 'User not found' }, status: :404
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
