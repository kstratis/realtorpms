module UsersHelper
  extend ActiveSupport::Concern

  # Adds gravatar support
  # Returns the Gravatar for the given user.
  def gravatar_for(user, size: 128, classname: 'gravatar', link_only: false, big_default_size: false)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    default_image = big_default_size ? 'https://image.ibb.co/hQ96RR/anonymous_big.png' : 'https://image.ibb.co/eOvKfm/anonymous.png'
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}&d=#{default_image}"
    return URI.encode(gravatar_url) if link_only  # use this to get the url only. useful when js is in charge of view
    image_tag(gravatar_url, alt: user.first_name + user.last_name, class: classname)
  end

  # def alphatar_for(user=nil, classnames=nil, id=nil, js=false)
  #   content_tag :div, "#{user.first_name.upcase.first}#{user.last_name.upcase.first}", class: "alphatar #{classnames}", style: "background-color: ##{user.try(:color) || 'B76BA3'}", alt: "profile-pic", id: "#{id}"
  # end

  # entity can be an account object model or a user (@account.owner)
  def inline_error(entity, attribute, formatted_attribute)
    if entity.errors[attribute].present?
      render :partial => 'shared/error_inline_message',
             :locals => {:error => entity.errors[attribute].first,
                         :formatted_attribute => formatted_attribute}
    end
  end

  # Returns the user avatar if one exists, otherwise it returns the gravatar
  # def user_avatar(user, classnames=nil, id=nil, js=false )
  #   if user.avatar.attached?
  #     js ? url_for(user.avatar) : image_tag(user.avatar, class: classnames, id: id)
  #   else
  #     # gravatar_for user, size: 64, classname: 'avatar-outline', link_only: false, big_default_size: true
  #     alphatar_for user, classnames, id
  #   end
  # end

end
