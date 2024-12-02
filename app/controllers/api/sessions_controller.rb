module Api
  class SessionsController < ApplicationController
    def create
      @user = User.find_by(username: params[:user][:username])

      if @user && @user.authenticate(params[:user][:password])
        session = @user.sessions.create
        cookies.permanent.signed[:twitter_session_token] = {
          value: session.token,
          httponly: true
        }

        render json: { success: true, user: @user }
      else
        render json: { success: false, error: 'Invalid username or password' }, status: :unauthorized
      end
    end

    def authenticated
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)

      if session
        render json: { authenticated: true, user: session.user }
      else
        render json: { authenticated: false }
      end
    end

    def destroy
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)

      if session&.destroy
        cookies.delete(:twitter_session_token)
        render json: { success: true }
      else
        render json: { success: false }, status: :unprocessable_entity
      end
    end
  end
end
