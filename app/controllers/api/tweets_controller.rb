module Api
  class TweetsController < ApplicationController
    def index
      @tweets = Tweet.includes(:user).order(created_at: :desc)
      render json: @tweets.as_json(include: { user: { only: [:username, :id] } })
    end

    def create
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)
      user = session&.user

      return render json: { error: 'Unauthorized' }, status: :unauthorized unless user

      if user.tweets.where('created_at > ?', Time.now - 60.minutes).count >= 30
        return render json: { error: 'Rate limit exceeded (30 tweets/hour)' }, status: :too_many_requests
      end

      @tweet = user.tweets.new(tweet_params)
      if @tweet.save
        TweetMailer.notify(@tweet).deliver!
        render json: @tweet, status: :created
      else
        render json: { error: @tweet.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)
      user = session&.user

      return render json: { success: false }, status: :unauthorized unless user

      tweet = user.tweets.find_by(id: params[:id])
      if tweet&.destroy
        render json: { success: true }
      else
        render json: { success: false }, status: :unprocessable_entity
      end
    end

    private

    def tweet_params
      params.require(:tweet).permit(:message, :image)
    end
  end
end
