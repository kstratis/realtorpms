module UsersHelper
  extend ActiveSupport::Concern

  # Adds gravatar support
  # Returns the Gravatar for the given user.
  def gravatar_for(user, size: 128, classname: 'gravatar', link_only: false, big_default_size: false)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    default_image = big_default_size ? 'https://image.ibb.co/hQ96RR/anonymous_big.png' : 'https://image.ibb.co/eOvKfm/anonymous.png'
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}&d=#{default_image}"
    return URI.encode(gravatar_url) if link_only # use this to get the url only. useful when js is in charge of view
    image_tag(gravatar_url, alt: user.first_name + user.last_name, class: classname)
  end

  # entity can be an account object model or a user (@account.owner)
  def inline_error(entity, attribute, formatted_attribute)
    if entity.errors[attribute].present?
      render :partial => 'shared/error_inline_message',
             :locals => { :error => entity.errors[attribute].first,
                          :formatted_attribute => formatted_attribute }
    end
  end

  def users_modal_data(user)
    entries = [
      {
        name: 'AddRemoveProperties',
        button: {
          content: '<i class="fas fa-home fa-fw"></i><span class="d-none d-lg-inline">&nbsp; ' + t('users.show.toolbar.assignment_title') + '</span>',
          size: 'sm',
          tooltip: t('users.show.toolbar.assignment_tooltip'),
          wrapperDivClassname: 'reactstrap-modal-button-right'
        },
        modal: {
          i18n: {
            modal: {
              search_placeholder: t('header.search'),
              no_results: t('users.show.modal.no_results')
            }
          },
          size: 'md',
          user_id: user.id,
          hasFeedback: true,
          buttonCloseLabel: t('properties.close_button'),
          modalDialogCSSClasses: 'modal-custom-dialog',
          modalContentCSSClasses: 'modal-custom-content',
          modalBodyCSSClasses: 'modal-custom-body',
          title: t('users.show.toolbar.assignment_tooltip'),
          soloMode: true,
          ajaxEnabled: false,
          isClearable: false,
          openMenuOnClick: true,
          closeMenuOnSelect: false,
          closeMenu: true,
          backspaceRemovesValue: true,
          isNotAnimated: true,
          isSearchable: false,
          isMultiple: true,
          scrollable: false,
          properties_list_search_url: properties_modal_listing_path(user),
          properties_action_endpoint: properties_modal_assign_path(user),
          initial_data_url: properties_modal_listing_path(user),
          defaultOptions: nil
        }
      }]
  end
end
