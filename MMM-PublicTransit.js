Module.register("MMM-PublicTransit", {

  defaults: {
    logosize: "40px",
    showlogo: true,
    global_stop_id: "",
    apiKey: "",
    displayed_entries: 3, // Number of bus times to display
    fontsize: "24px", // Font size for bus times
    logoLocation: "flex-end", // Logo alignment (flex-start, flex-end)
    activeHoursStart: 6,  // Active hours for the module (24-hour format)
    activeHoursEnd: 22,
    activeDays: [0, 1, 2, 3, 4, 5, 6], // Active days of the week (0 = Sunday, 6 = Saturday)
    updateFrequency: 30, // Update frequency in minutes
    delayMinutes: 0,
    direction: "",
  },

  getStyles() {
    return ["publictransit.css"];
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    
    // some dummy values
    this.busSchedule = [
      { route_short_name: "UhOh", departure_time: Date.now()/1000 - 60, direction: 'Outbound' },
      { route_short_name: "API", departure_time: Date.now()/1000 + 360, direction: 'Inbound' },
      { route_short_name: "Error", departure_time: Date.now()/1000 + 600, direction: 'Downtown' }
    ];
  
    let startTime = Math.floor(Date.now() / 1000) + this.config.delayMinutes * 60;
    console.log(this.config.direction);
    console.log(startTime);
    this.sendSocketNotification("FETCH_BUS_SCHEDULE", {apiKey:this.config.apiKey,global_stop_id:this.config.global_stop_id,activeHours:this.activeHours(),startTime:startTime})
    //setInterval(() => this.sendSocketNotification("FETCH_BUS_SCHEDULE", payload), this.config.updateFrequency * 60 * 1000);
    setInterval(() => this.sendSocketNotification("FETCH_BUS_SCHEDULE", {apiKey:this.config.apiKey,global_stop_id:this.config.global_stop_id,activeHours:this.activeHours(),startTime:startTime}), this.config.updateFrequency * 60 * 1000);
    setInterval(() => this.updateDom(), 30000)
  },

  notificationReceived(notification, payload) {
    if (notification === "UPDATE_BUS_SCHEDULE") {
      this.busSchedule = payload;
      //this.updateDom();
    }
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "UPDATE_BUS_SCHEDULE") {
      this.busSchedule = payload;
      this.updateDom();
    }
  },

  getDom() {
//    console.log(this.busSchedule); 
  // Create the main container div
    const container = document.createElement('div');
    container.classList.add('container');

    // Create a div for bus times
    const busTimesContainer = document.createElement('div');
    busTimesContainer.classList.add('bustimes_container');

    if (!this.config.apiKey) {
      const inactiveMessage = document.createElement('p');
      inactiveMessage.textContent = "Provide an API key";
      inactiveMessage.classList.add("inactive");
      busTimesContainer.appendChild(inactiveMessage);
      container.appendChild(busTimesContainer);
      return container; // Return early
    }

    if (!this.activeHours()) {
      const inactiveMessage = document.createElement('p');
      inactiveMessage.textContent = "Inactive";
      inactiveMessage.classList.add("inactive");
      busTimesContainer.appendChild(inactiveMessage);
      container.appendChild(busTimesContainer);
      return container; // Return early if outside active hours
    }

    // Show bus times
    // Create the headers
    const busTimesHeader = document.createElement('div');
    busTimesHeader.classList.add('header_info');

    const routeHeader = document.createElement('span');
    routeHeader.classList.add("route_header");
    routeHeader.textContent = "Route";

    const departureHeader = document.createElement('span');
    departureHeader.classList.add("departure_header");
    departureHeader.textContent = "Leave in";

    busTimesHeader.appendChild(routeHeader);
    busTimesHeader.appendChild(departureHeader);

    busTimesContainer.appendChild(busTimesHeader);


    let i = 0;
    let j = 0;
    while (i < this.busSchedule.length && j < this.config.displayed_entries) {

      if (Math.round((this.busSchedule[i].departure_time - Date.now()/1000) / 60) < 2) {
        i++;
        continue;
      }

      //skip if we've set a direction (inbound/outbound) and it doesn't match)
      if (this.config.direction && this.busSchedule[i].direction.toLowerCase() != this.config.direction.toLowerCase()) {
        i++;
        continue;
      }

      const busTimeContainer = document.createElement('div');

      const routeInfo = document.createElement("p");
      routeInfo.classList.add("route_info");

      const routeName = document.createElement('span');
      routeName.classList.add("route_name");
      routeName.textContent = this.busSchedule[i].route_short_name;

      const departureTime = document.createElement('span');
      departureTime.classList.add("departure_time");
      departureTime.textContent = (Math.round((this.busSchedule[i].departure_time - Date.now()/1000) / 60) - this.config.delayMinutes) + " min";

      routeInfo.appendChild(routeName);
      routeInfo.appendChild(departureTime);

      busTimeContainer.appendChild(routeInfo);

      busTimesContainer.appendChild(busTimeContainer);

      i++;
      j++;
    }

    container.appendChild(busTimesContainer);

    // Create the image element
    if (this.config.showlogo) {
    const transitlogoContainer = document.createElement('div');
    transitlogoContainer.classList.add("transit_logo");

    const transitlogo = document.createElement('img');
    transitlogo.src = 'modules/MMM-PublicTransit/Images/transit-api-badge.png';
    transitlogo.alt = 'Transit logo';

    transitlogoContainer.appendChild(transitlogo);
    container.appendChild(transitlogoContainer);
    }

    return container;
  },

  activeHours() {
    // Check if the current time is within the active hours
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const startHour = this.config.activeHoursStart;
    const stopHour = this.config.activeHoursEnd;
    const activeDays = this.config.activeDays;

    if (startHour === undefined || stopHour === undefined || activeDays === undefined) {
      return true; // If active hours or days are not defined, always show the module
    }

    if (startHour <= currentHour && currentHour < stopHour && activeDays.includes(currentDay)) {
      return true;
    } else {
      return false;
    }
  },

});
