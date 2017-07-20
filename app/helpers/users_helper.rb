module UsersHelper
  # Adds gravatar support
  # Returns the Gravatar for the given user.
  def gravatar_for(user, size: 128)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: user.first_name + user.last_name, class: 'gravatar')
  end

  def inline_error(attribute, formatted_attribute)
    if @user.errors[attribute].present?
      render :partial => 'shared/error_inline_message',
             :locals => {:error => @user.errors[attribute].first,
                         :formatted_attribute => formatted_attribute}
    end
  end

end
