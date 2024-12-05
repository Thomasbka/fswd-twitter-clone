json.array! @tweets do |tweet|
  json.id tweet.id
  json.message tweet.message
  json.user do
    json.username tweet.user.username
  end
  if tweet.image.attached?
    json.image url_for(tweet.image)
  else
    json.image nil
  end
end
