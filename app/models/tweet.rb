class Tweet < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  validates :user, presence: true
  validates :message, presence: true, length: { maximum: 140 }

  after_create_commit do
    ActionCable.server.broadcast("tweets_channel", {
      id: self.id,
      message: self.message,
      user: {
        id: self.user.id,
        username: self.user.username,
      },
      created_at: self.created_at.strftime("%Y-%m-%d %H:%M:%S")
    })
  end

  def image_url
    image.attached? ? Rails.application.routes.url_helpers.url_for(image) : nil
  end
end
