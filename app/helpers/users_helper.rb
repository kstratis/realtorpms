module UsersHelper
  # Adds gravatar support
  # Returns the Gravatar for the given user.
  def gravatar_for(user, size: 128)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: user.first_name + user.last_name, class: 'gravatar')
  end

  # entity can be an account object model or a user (@account.owner)
  def inline_error(entity, attribute, formatted_attribute)
    if entity.errors[attribute].present?
      render :partial => 'shared/error_inline_message',
             :locals => {:error => entity.errors[attribute].first,
                         :formatted_attribute => formatted_attribute}
    end
  end

end
