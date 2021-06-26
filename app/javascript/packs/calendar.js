import jsCalendar_lang_gr from 'jsCalendar-custom.lang.gr'; // Don't remove this
import jsCalendar from 'jsCalendar-custom';
import axios from 'axios';
import bootbox from 'bootbox';

// Polyfill for Object.entries
// ---------------------------
if (!Object.entries) {
  Object.entries = function( obj ){
    let ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}
// ---------------------------

class CalendarManager {
  constructor(calendarDomEl, eventsDomEl, calendarLib, locale) {
    this.calendarDomEl = calendarDomEl;
    this.eventsDomEl = eventsDomEl;
    this.calendarLib = calendarLib;
    this.locale = locale;
    this.calendar = null;
    this.initialLoad = true;
    this.dateFormat = 'DD/MM/YYYY';
    // Use this to get date data from form buttons
    this.globalDate = new Date(); // This is today
    this.eventsUI = {};
    this.translation = {};
    this.ajaxUrl = '';
    // Calendar events are stored in a structure like this:
    // this.events #=> {'22/12/2020': [{description: demo, id: 1}, {description: test, id: 2}],
    //                  '25/12/2020': [{description: sample, id: 3}, {description: check, id: 4}], ...}
    this.events = {};
  }

  init() {
    this.loadLocales();
    this.buildEventsUI();
    this.buildCalendarInstance();
    this.setEventListeners();
  }

  buildEventsUI() {
    // Create events elements
    this.eventsUI.title = document.createElement('div');
    this.eventsUI.title.className = 'title';
    this.eventsDomEl.appendChild(this.eventsUI.title);
    this.eventsUI.subtitle = document.createElement('div');
    this.eventsUI.subtitle.className = 'subtitle';
    this.eventsDomEl.appendChild(this.eventsUI.subtitle);
    this.eventsUI.list = document.createElement('div');
    this.eventsUI.list.className = 'list';
    this.eventsDomEl.appendChild(this.eventsUI.list);
    this.eventsUI.actions = document.createElement('div');
    this.eventsUI.actions.className = 'action';
    this.eventsDomEl.appendChild(this.eventsUI.actions);
    this.eventsUI.addButton = document.createElement('input');
    this.eventsUI.addButton.type = 'button';
    this.eventsUI.addButton.className = 'btn btn-success';
    this.eventsUI.addButton.value = this.translation.add;
    this.eventsUI.actions.appendChild(this.eventsUI.addButton);
  }

  setTranslation(translation){
    this.translation = translation;
  }

  setAjaxUrl(url){
    this.ajaxUrl = url;
  }

  loadLocales() {
    if (this.locale === 'en') return;
    // We currently only load Greek apart from English
    // which is the default
    jsCalendar_lang_gr(this.calendarLib);
  }

  buildCalendarInstance() {
    this.calendar = this.calendarLib.new('#calendar', 'now', {
      navigatorPosition: 'right',
      monthFormat: 'month YYYY',
      dayFormat: 'DDD',
      firstDayOfTheWeek: '2',
      language: this.locale === 'el' ? 'gr' : this.locale,
    });
  }

  getFullDayName(date){
    return this.calendar.language.days[date.getDay()]
  }

  // Converts a given date object to string. i.e. 15/12/2020 => "15/12/2020"
  convertDateToString(date) {
    return this.calendarLib.tools.dateToString(date, this.dateFormat, this.locale);
  }

  // Converts a given date string to date object. i.e. "15/12/2020" => 15/12/2020
  convertStringToDate(date) {
    return this.calendarLib.tools.parseDate(date);
  }

  highlightEventDates() {
    // Highlight (outline) selected date in Calendar if no events previously existed
    Object.keys(this.events).forEach(date => {
      this.calendar.select(this.convertStringToDate(date));
    });
  }

  storeEvents(events) {
    // DEBUG
    // console.log(events)
    for (const [dateKey, eventValues] of Object.entries(events)) {
      const dateString = this.convertDateToString(new Date(dateKey));
      this.events[dateString] = [];
      this.events[dateString].push(...eventValues);
    }
    this.highlightEventDates();
  }

  loadMonthEvents(date) {
    this.handleNetworkCall(
      'get',
      this.ajaxUrl,
      { date: this.convertDateToString(date), scope: 'month' },
      ajaxResponse => {
        this.storeEvents(ajaxResponse.data.message);
      }
    );
  }

  // Fetches all events for a given date
  showDateEvents(date) {
    // Set global date
    this.globalDate = new Date(date.getTime());
    // Set title
    // this.eventsUI.title.textContent = `${this.getFullDayName(date)} ${this.convertDateToString(date)}`;
    this.eventsUI.title.textContent = this.convertDateToString(date);
    // Clear old events
    this.eventsUI.list.innerHTML = '';

    this.renderEvents();
  }

  // Renders all events for a given date
  renderEvents() {
    // Date string
    const dateString = this.convertDateToString(this.globalDate);
    const events = this.events[dateString];

    if (events === undefined || !events.length) {
      this.eventsUI.subtitle.textContent = this.translation['noEvents'];
      this.eventsUI.list.innerHTML = '<div class="no-entries-calendar reduced-opacity"><i class="no-results-alt-2"> </i></div>';
      return;
    }

    this.eventsUI.subtitle.textContent = events.length + ' ' + (events.length > 1 ? this.translation.events : this.translation.event);

    // DEBUG
    // console.log(events);
    let divWrapper, divLabel, spanLabel, spanText, divCloseBtn;

    // For each event
    events.forEach((event, index) => {
      divWrapper = document.createElement('div');
      divWrapper.className = 'd-flex event-item';
      this.eventsUI.list.appendChild(divWrapper);
      divLabel = document.createElement('div');
      divLabel.className = 'flex-grow-1';

      spanLabel = document.createElement('span');
      spanLabel.className = "calendar-entry-markup";
      spanLabel.textContent = "•";
      divLabel.appendChild(spanLabel);

      spanText = document.createElement('span');
      spanText.className = "";
      spanText.textContent = event.description;
      divLabel.appendChild(spanText);

      divWrapper.appendChild(divLabel);
      divCloseBtn = document.createElement('div');
      divCloseBtn.className = 'close align-self-center';
      divCloseBtn.textContent = '×';
      divWrapper.appendChild(divCloseBtn);


      divCloseBtn.addEventListener(
        'click',
        ((dateString, index) => {
          let that = this;
          return () => {
            bootbox.confirm({
              title: that.translation['eventInfoDeleteTitle'],
              message: that.translation['eventInfoDeleteBody'],
              centerVertical: true,
              buttons: {
                confirm: {
                  label: 'Yes',
                  className: 'btn-success'
                },
                cancel: {
                  label: 'No',
                  className: 'btn-danger'
                }
              },
              callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result){
                  that.handleRemoveEvent(dateString, index, event.path);
                }
              }
            });

          };
        })(dateString, index),
        false
      );
    });
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

  // Remove an event from individual dates
  handleRemoveEvent(dateString, domIndex, eventPath) {
    // If no events exist or the event is not found return
    if (!this.events.hasOwnProperty(dateString) || this.events[dateString].length <= domIndex) return;

    this.handleNetworkCall('delete', `${eventPath}.json`, {}, () => {
      // Remove the event locally
      this.events[dateString].splice(domIndex, 1);
      // Rerender
      this.showDateEvents(this.globalDate);
      // If there are no remaining events for this date, unmark it
      if (!this.events[dateString].length) this.calendar.unselect(this.globalDate);
    });
  }

  // Add calendar events
  setEventListeners() {
    // -=On calendar day click=-
    this.calendar.onDateClick((event, date) => {
      // Update internal calendar to track given date
      this.calendar.set(date);
      // Show the date's events
      this.showDateEvents(date);
    });

    // -=On calendar month click=-
    this.calendar.onMonthChange((event, date) => {
      // Load all month events
      this.loadMonthEvents(date);
    });

    // -=On add event button=-
    this.eventsUI.addButton.addEventListener(
      'click',
      () => {
        // Get event info
        bootbox.prompt({
          title: this.translation['eventInfoAddTitle'],
          centerVertical: true,
          callback: description => {
            console.log(description);
            // Return on cancel
            if (description === null || description === '') {
              return;
            }

            const dateString = this.convertDateToString(this.globalDate);

            if (!this.events.hasOwnProperty(dateString)) {
              this.events[dateString] = [];
            }

            // Highlight (outline) selected date in Calendar if no events previously existed
            if (!this.events[dateString].length) this.calendar.select(this.globalDate);

            this.handleNetworkCall(
              'post',
              this.ajaxUrl,
              { description: description, created_for: dateString },
              event => {
                // Refresh events after submitting
                this.events[dateString].push(event.data.message);
                this.showDateEvents(this.globalDate);
              }
            );
          },
        });
      },
      false
    );
  }
}

$(document).on('turbolinks:load', function () {
  const calendarDomEl = document.getElementById('calendar');
  if (!calendarDomEl) return;

  const eventsDomEl = document.getElementById('events');
  if (!eventsDomEl) return;

  const locale = JSON.parse(document.querySelector('#current_locale').dataset.i18n).locale || 'en';

  // Create new calendar manager instance
  const calendar_manager = new CalendarManager(calendarDomEl, eventsDomEl, jsCalendar, locale);
  // Set its language
  const translation = JSON.parse(document.getElementById('calendar_events_i18n').dataset.ceventsi18n);
  calendar_manager.setTranslation(translation);
  // Get its path
  const url = document.getElementById('calendar_events_url').dataset.url;
  calendar_manager.setAjaxUrl(url);

  // ...and fire it up
  calendar_manager.init();
  // By default show today's events
  const data = JSON.parse(document.getElementById('calendar_events').dataset.cevents);
  calendar_manager.storeEvents(data);
  calendar_manager.showDateEvents(new Date());
});
