import Shepherd from 'shepherd.js';
import axios from 'axios';

export default class TourManager {
  constructor(tour_data, stage) {
    this.tour_data = tour_data;
    this.tourInstance = new Shepherd.Tour({
      useModalOverlay: true,
      confirmCancel: true,
      confirmCancelMessage: this.tour_data.i18n.confirm_cancel_message,
      exitOnEsc: false,
      defaultStepOptions: {
        classes: '',
        scrollTo: true,
      },
      cancelIcon: {
        enabled: false,
      },
      scrollTo: { behavior: 'smooth', block: 'center' },
    });
    this.setupTourSteps();
    // Avoid ajax calls when replaying the tour
    if (stage === 'onload') {
      this.setupTourHandlers();
    }
  }

  setupTourSteps() {
    this.tourInstance.addSteps([
      {
        id: 'welcome-slide',
        title: `<div class='tour-title'>${this.tour_data.i18n.welcome.title}</div>`,
        text: `<div class='tour-body text-center'>${this.tour_data.i18n.welcome.body_html}</div>`,
        classes: '',
        buttons: [
          {
            text: this.tour_data.i18n.buttons.next,
            action: this.tourInstance.next,
            classes: 'flex-grow-1',
          },
        ],
      },
      {
        id: 'properties-nav',
        title: `<div class='tour-title'>${this.tour_data.i18n.properties.title}</div>`,
        text: `<div class='tour-body'>${this.tour_data.i18n.properties.body_html}</div>`,
        attachTo: {
          element: '#properties-nav',
          on: 'bottom',
        },
        canClickTarget: false,
        cancelIcon: {
          enabled: true,
        },
        classes: '',
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: this.tour_data.i18n.buttons.back,
          },
          {
            text: this.tour_data.i18n.buttons.next,
            action: this.tourInstance.next,
            classes: 'flex-grow-1',
          },
        ],
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
        },
      },
      {
        id: 'clients-nav',
        title: `<div class='tour-title'>${this.tour_data.i18n.clients.title}</div>`,
        text: `<div class='tour-body'>${this.tour_data.i18n.clients.body_html}</div>`,
        attachTo: {
          element: '#clients-nav',
          on: 'bottom',
        },
        canClickTarget: false,
        cancelIcon: {
          enabled: true,
        },
        classes: '',
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: this.tour_data.i18n.buttons.back,
          },
          {
            text: this.tour_data.i18n.buttons.next,
            action: this.tourInstance.next,
            classes: 'flex-grow-1',
          },
        ],
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
        },
      },
    ]);

    if (this.tour_data.is_admin) {
      this.tourInstance.addStep(
        {
          id: 'partners-nav',
          title: `<div class='tour-title'>${this.tour_data.i18n.partners.title}</div>`,
          text: `<div class='tour-body'>${this.tour_data.i18n.partners.body_html}</div>`,
          attachTo: {
            element: '#partners-nav',
            on: 'bottom',
          },
          canClickTarget: false,
          cancelIcon: {
            enabled: true,
          },
          classes: '',
          buttons: [
            {
              action() {
                return this.back();
              },
              classes: 'shepherd-button-secondary',
              text: this.tour_data.i18n.buttons.back,
            },
            {
              text: this.tour_data.i18n.buttons.next,
              action: this.tourInstance.next,
              classes: 'flex-grow-1',
            },
          ],
          popperOptions: {
            modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
          },
        },
        1
      );
      this.tourInstance.addSteps([
        {
          id: 'protools-nav',
          title: `<div class='tour-title'>${this.tour_data.i18n.protools.title}</div>`,
          text: `<div class='tour-body'>${this.tour_data.i18n.protools.body_html}</div>`,
          attachTo: {
            element: '#protools-nav',
            on: 'left',
          },
          canClickTarget: false,
          cancelIcon: {
            enabled: true,
          },
          classes: 'shepherd-website-centering',
          buttons: [
            {
              action() {
                return this.back();
              },
              classes: 'shepherd-button-secondary',
              text: this.tour_data.i18n.buttons.back,
            },
            {
              text: this.tour_data.i18n.buttons.next,
              action: this.tourInstance.next,
              classes: 'flex-grow-1',
            },
          ],
          popperOptions: {
            modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
          },
          when: {
            // Use this to show the menu modal before the first menu entry is introduced.
            show: function() {
              $('#account-dropdown-menu-element').dropdown('toggle');
            }
          }
        },
        {
          id: 'website-nav',
          title: `<div class='tour-title'>${this.tour_data.i18n.website.title}</div>`,
          text: `<div class='tour-body'>${this.tour_data.i18n.website.body_html}</div>`,
          attachTo: {
            element: '#website-nav',
            on: 'left',
          },
          canClickTarget: false,
          cancelIcon: {
            enabled: true,
          },
          buttons: [
            {
              action() {
                return this.back();
              },
              classes: 'shepherd-button-secondary',
              text: this.tour_data.i18n.buttons.back,
            },
            {
              text: this.tour_data.i18n.buttons.next,
              action: this.tourInstance.next,
              classes: 'flex-grow-1',
            },
          ],
          popperOptions: {
            modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
          },
          when: {
            // Use this to dispose the modal after the last menu entry is introduced.
            hide: function() {
              $('#account-dropdown-menu-element').dropdown('hide');
              $('#account-dropdown-menu-element').dropdown('dispose');
            }
          }
        }
      ]);
    }
    this.tourInstance.addStep({
      id: 'goodbye-slide',
      title: `<div class='tour-title'>${this.tour_data.i18n.goodbye.title}</div>`,
      text: `<div class='tour-body text-center'>${this.tour_data.i18n.goodbye.body_html}</div>`,
      classes: '',
      buttons: [
        {
          text: this.tour_data.i18n.buttons.end,
          action: this.tourInstance.next,
          classes: 'flex-grow-1',
        },
      ],
    });
  }

  setupTourHandlers() {
    ['complete', 'cancel'].forEach(event =>
      this.tourInstance.on(event, () => {
        this.handleNetworkCall('patch', this.tour_data.tour_url, {}, event => {
          console.log('Welcome Tour successfully ended');
        });
      })
    );
  }

  // Makes the actual AJAX call
  handleNetworkCall(method, url, payload, callback) {
    axios({
      method: method,
      url: url,
      data: payload,
      params: payload,
    }).then(response => callback(response));
  }

  start() {
    this.tourInstance.start();
  }
}
