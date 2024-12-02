class FeedsController < ApplicationController
  def index
    render file: 'ublic/index.html', layout: false
  end
end
