class User < ApplicationRecord
  has_many :sessions, dependent: :destroy
  has_many :tweets
  has_many :follower_relationships, foreign_key: :followed_id, class_name: "Follow"
  has_many :followers, through: :follower_relationships, source: :follower

  has_many :followed_relationships, foreign_key: :follower_id, class_name: "Follow"
  has_many :following, through: :followed_relationships, source: :followed


  has_secure_password

  validates :username, presence: true, length: { minimum: 3, maximum: 64 }, uniqueness: true
  validates :password, presence: true, length: { minimum: 8, maximum: 64 }
  validates :email, presence: true, length: { minimum: 5, maximum: 500 }, uniqueness: true
end
