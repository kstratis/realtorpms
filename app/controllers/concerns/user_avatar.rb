module UserAvatar
  extend ActiveSupport::Concern

  def alphatar_for(user = nil, classnames = nil, id = nil, js = false)
    if js
      puts "todo"
    else
      content_tag :div, "#{user.first_name.upcase.first}#{user.last_name.upcase.first}", class: "alphatar #{classnames}", style: "background-color: ##{user.try(:color) || 'B76BA3'}", alt: "profile-pic", id: "#{id}"
    end
  end

  def user_avatar(user, classnames = nil, id = nil, js = false)
    if user.avatar.attached?
      js ? url_for(user.avatar) : image_tag(user.avatar, class: classnames, id: id)
    else
      # gravatar_for user, size: 64, classname: 'avatar-outline', link_only: false, big_default_size: true
      # puts 'nothing'
      alphatar_for user, classnames, id, js
    end
  end


end