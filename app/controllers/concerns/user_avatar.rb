module UserAvatar
  extend ActiveSupport::Concern

  def alphatar_for(user = nil, classnames = nil, id = nil, js = false)
    if js
      "#{user.first_name.upcase.first}#{user.last_name.upcase.first}"
    else
      content_tag :div, "#{user.first_name.upcase.first}#{user.last_name.upcase.first}", class: "alphatar #{classnames}", style: "background-color: ##{user.try(:color) || 'B76BA3'}", alt: "profile-pic", id: "#{id}"
    end
  end

  def render_avatar(entity, classnames = nil, id = nil, js = false)
    if entity.avatar.attached?
      js ? url_for(entity.avatar) : image_tag(entity.avatar, class: classnames, id: id)
    else

      if entity.class == User
        # gravatar_for entity, size: 64, classname: 'avatar-outline', link_only: false, big_default_size: true
        # puts 'nothing'
        alphatar_for entity, classnames, id, js
      else
        content_tag :div, "", class: "alphatar #{classnames}", id: "#{id}" do
          content_tag :i, "", class: "pr-icon md house-avatar-placeholder"
        end
      end

    end
  end


end