module Api
  class SessionsController < ApplicationController
    def create
      Rails.logger.debug "SessionsController#create called"
      Rails.logger.debug "Params: #{params.inspect}"
    
      @user = User.find_by(username: params.dig(:user, :username))
      Rails.logger.debug "User found: #{@user.inspect}"
    
      if @user&.authenticate(params.dig(:user, :password))
        session = @user.sessions.create
        Rails.logger.debug "Session created: #{session.inspect}"
    
        cookies.permanent.signed[:twitter_session_token] = {
          value: session.token,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax
        }
        Rails.logger.debug "Cookie set with token: #{session.token}"
    
        render json: { success: true, user: @user, redirect_url: "/feeds" }
      else
        Rails.logger.debug "Login failed for username: #{params.dig(:user, :username)}"
        render json: { success: false, error: "Invalid username or password" }, status: :unauthorized
      end
    end
    
    

    def authenticated
      token = cookies.signed[:twitter_session_token]
      Rails.logger.debug "Token from cookie: #{token.inspect}"
      
      if token.nil?
        Rails.logger.debug "No token found in cookies."
        render json: { authenticated: false, error: "No token in cookies" }
        return
      end
      
      session = Session.find_by(token: token)
      Rails.logger.debug "Session found: #{session.inspect}"
      
      if session
        render json: { authenticated: true, user: session.user }
      else
        render json: { authenticated: false }
      end
    end
    

    def destroy
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)
  
      if session
        session.destroy
        cookies.delete(:twitter_session_token)
        render json: { success: true }
      else
        render json: { error: 'No active session' }, status: :unprocessable_entity
      end
    end
  end
end
