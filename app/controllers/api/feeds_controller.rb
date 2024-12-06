module Api
  class FeedsController < ApplicationController
    def index
      render file: 'public/index.html', layout: false
    end
  end
end
