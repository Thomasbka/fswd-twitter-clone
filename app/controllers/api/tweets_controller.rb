module Api
  class TweetsController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:create]

    def index
      @tweets = Tweet.includes(:user).order(created_at: :desc)
      logger.debug "Fetched Tweets: #{@tweets.as_json(include: { user: { only: [:username, :id] } })}"
      render json: @tweets.as_json(include: { user: { only: [:username, :id] } })
    end
    

    def create
      puts "Params received: #{params.inspect}"
    
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)
      user = session&.user
    
      return render json: { error: 'Unauthorized' }, status: :unauthorized unless user
    
      if user.tweets.where('created_at > ?', Time.now - 60.minutes).count >= 30
        return render json: { error: 'Rate limit exceeded (30 tweets/hour)' }, status: :too_many_requests
      end
    
      @tweet = user.tweets.new(message: params[:tweet][:message])
    
      if params[:tweet][:image].present?
        uploaded_file = params[:tweet][:image]
        puts "Uploaded file: #{uploaded_file.inspect}"
    
        begin
          @tweet.image.attach(
            io: uploaded_file.tempfile,
            filename: uploaded_file.original_filename,
            content_type: uploaded_file.content_type
          )
          puts "Image attached successfully"
        rescue => e
          puts "Failed to attach image: #{e.message}"
          return render json: { error: "Image upload failed: #{e.message}" }, status: :unprocessable_entity
        end
      end
    
      if @tweet.save
        render json: @tweet.as_json(include: { user: { only: [:username] } }), status: :created
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
