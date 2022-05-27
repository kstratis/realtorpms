module ClientsHelper
  def clients_modal_data
    entries = [
      {
        name: 'AddRemoveShowings',
        button: {
          content: '<i class="fas fa-city fa-fw"></i><span class="d-none d-lg-inline">&nbsp;' + t('properties.viewings') + '</span>',
          size: 'sm',
          tooltip: t('js.clients_showings_tooltip')
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
          originator: 'client',
          showings_url: showings_url,
          client_id: client.id,
          title: t('properties.viewings_history', entity: "#{client.first_name.capitalize} #{client.last_name.capitalize}"),
          modalHeaderHelp: t("clients.help_popover_#{current_user.role(current_account)}"),
          buttonOKLabel: t('properties.ok_button'),
          buttonCancelLabel: t('properties.cancel_button'),
          buttonCloseLabel: t('properties.close_button'),
          soloMode: true,
          ajaxEnabled: false,
          isClearable: true,
          backspaceRemovesValue: true,
          isSearchable: false,
          feedback: t('js.forms.properties.wizard.step1.type_of_offer_feedback'),
          clients_url: clients_url,
          properties_url: properties_inlinesearch_url,
          partners_url: "#{users_url}?backend_option=#{@client.id}",
          isAdmin: current_user.is_admin?(current_account)
        }
      }
    ]
    if current_user.is_admin?(current_account)
      entries << {
        name: 'AddRemovePartners',
        button: {
          content: '<i class="fas fa-user-check colored fa-fw"></i><span class="d-none d-lg-inline">&nbsp;' + t('activerecord.attributes.property.assignments_title') + '</span>',
          size: 'sm',
          tooltip: t('js.properties_assignments_tooltip')
        },
        modal: {
          i18n: {
            select: {
              placeholder: t('js.components.select.placeholder_title'),
              noresults: t('js.components.select.noresults'),
              loading: t('js.components.select.loading_html'),
              feedback: t('js.components.select.assignments_client_feedback', client_name: client.full_name)
            }
          },
          size: 'md',
          property_id: client.id,
          scrollable: false,
          avatar: nil,
          hasFeedback: true,
          isNotAnimated: true,
          title: t('assignments.client_title', entity: client.full_name),
          buttonCloseLabel: t('properties.close_button'),
          soloMode: true,
          ajaxEnabled: false,
          isClearable: false,
          backspaceRemovesValue: true,
          isSearchable: false,
          isMultiple: true,
          partners_url: users_url,
          partners_action_endpoint: clientships_path(client),
          initial_data_url: existing_clientships_path(client),
          defaultOptions: current_account.users.blank? ? nil : current_account.users.order(created_at: :asc).last(8).map { |user| { label: "#{user.first_name} #{user.last_name}", value: user.id } }
        }
      }
    end
    entries
  end

  def client_prefs_data
    entries = [
      {
        name: 'RetrieveClientSearch',
        button: {
          content: '<i class="fas fa-eye fa-fw"></i><span class="d-none d-lg-inline">&nbsp;' + t('js.clients_store_searches_tooltip') + '</span>',
          size: 'sm',
          tooltip: t('clients.show.search_prefs'),
          classname: 'btn-secondary',
          wrapperDivClassname: 'reactstrap-modal-button-x'
        },
        modal: {
          i18n: {
            search_save_filters: t('js.components.modal.search_save.filters'),
            search_save_subtitle: t('js.components.modal.search_save.header', client_name: client.full_name),
            no_lists_available: t('js.components.modal.favlists.no_results'),
            search_save_criteria: t('js.components.modal.search_save.criteria'),
            property_cover_alt: t('js.components.modal.favlists.property_cover_alt'),
            add_list_action: t('js.components.modal.favlists.add_list_action'),
            loading_alt: t('js.components.modal.favlists.loading_alt'),
            listname_placeholder: t('js.components.modal.favlists.listname_placeholder')
          },
          title: t('js.components.modal.search_save.title_alt'),
          buttonCloseLabel: t('properties.close_button'),
          soloMode: true,
          searchprefs: client.searchprefs,
          ajaxEnabled: true,
          isClearable: true,
          buttonDisabled: client.searchprefs.blank?,
          backspaceRemovesValue: true,
          isSearchable: true,
          i18nPriceOptions: price_options,
          i18nSizeOptions: size_options,
          i18nFloorOptions: floors_options,
          i18nCategoryOptions: category_options,
          i18nCfieldOptions: cfields_options,
          feedback: t('js.forms.properties.wizard.step1.type_of_offer_feedback'),
        }
      }
    ]
  end
end