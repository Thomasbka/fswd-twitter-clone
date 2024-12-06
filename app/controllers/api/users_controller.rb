module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        session = @user.sessions.create
        cookies.permanent.signed[:twitter_session_token] = {
          value: session.token,
          httponly: true
        }

        render json: { success: true, user: @user }
      else
        render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      @user = User.find_by(username: params[:username])

      if @user
        render json: {
          username: @user.username,
          tweets: @user.tweets,
          following_count: @user.following.count,
          followers_count: @user.followers.count
        }
      else
        render json: { error: 'User not found' }, status: 404
      end
    end

    def tweets
      user = User.find_by(username: params[:username])
      if user
        tweets = user.tweets.includes(:user).order(created_at: :desc)
        render json: tweets.as_json(include: { user: { only: [:username] } })
      else
        render json: { error: "User not found" }, status: :not_found
      end
    end
    

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
