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
      },
      # NEW DATA HERE
      {
        name: 'AddRemoveShowings',
        button: {
          content: '<i class="fas fa-users fa-fw"></i><span class="d-none d-lg-inline">&nbsp;' + t('properties.viewings') + '</span>',
          size: 'sm',
          tooltip: t('js.properties_showings_tooltip')
        },
        modal: {
          i18n: {
            table: {
              client: t('viewings.client'),
              user: t('viewings.user'),
              property: t('properties.property'),
              date_title: t('date_title'),
              add: t("viewings.add_btn"),
              actions: t("viewings.actions"),
              tooltip_delete: t('tooltips.delete'),
              delete_prompt: t('viewings.delete_prompt')
            },
            form: {
              title: t('viewings.add'),
              property: t('properties.property'),
              partner: t('users.user'),
              client: t('clients.client'),
              date: t('viewings.date'),
              submit: t('viewings.submit'),
              warning: t('viewings.empty_fields_msg'),
              list: t('viewings.list'),
              required: t('js.components.select.required'),
              comments: t('viewings.comments'),
              comments_placeholder: t('viewings.comments_placeholder'),
              comments_feedback: t('viewings.comments_feedback')
            },
            select: {
              placeholder: t('js.components.select.placeholder_title'),
              noresults: t('js.components.select.noresults'),
              loading: t('js.components.select.loading_html')
            },
            no_lists_available: t('js.components.modal.favlists.no_results'),
            property_cover_alt: t('js.components.modal.favlists.property_cover_alt'),
            add_list_action: t('js.components.modal.favlists.add_list_action'),
            loading_alt: t('js.components.modal.favlists.loading_alt'),
            listname_placeholder: t('js.components.modal.favlists.listname_placeholder')
          },
          size: 'lg',
          avatar: nil,
          originator: 'user',
          showings_url: showings_url,
          user_id: @user.id,
          title: t('properties.viewings_history', entity: "#{@user.first_name.capitalize} #{@user.last_name.capitalize}"),
          modalHeaderHelp: t("users.help_popover_#{current_user.role(current_account)}"),
          buttonOKLabel: t('properties.ok_button'),
          buttonCancelLabel: t('properties.cancel_button'),
          buttonCloseLabel: t('properties.close_button'),
          soloMode: true,
          ajaxEnabled: false,
          isClearable: true,
          backspaceRemovesValue: true,
          isSearchable: false,
          feedback: t('js.forms.properties.wizard.step1.type_of_offer_feedback'),
          clients_url: "#{clients_url}?backend_option=#{@user.id}",
          properties_url: properties_inlinesearch_url,
          partners_url: users_url,
          isAdmin: current_user.is_admin?(current_account)
        }
      }
    ]
    entries
  end
end
