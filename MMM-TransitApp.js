Module.register("MMM-TransitApp", {

  defaults: {
    logosize: "40px",
    global_stop_id: "",
    apiKey: "",
    displayed_entries: 3, // Number of bus times to display
    fontsize: "28px", // Font size for bus times
  },

  getStyles() {
    return ["transitapp.css"];
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    
    // some dummy values
    this.busSchedule = [
      { route_short_name: "FF1", departure_time: Date.now()/1000 - 60 },
      { route_short_name: "FF2", departure_time: Date.now()/1000 + 360 },
      { route_short_name: "FF1", departure_time: Date.now()/1000 + 900 },
    ];
    const payload = {
      apiKey: this.config.apiKey,
      global_stop_id: this.config.global_stop_id,
    };
    this.sendSocketNotification("FETCH_BUS_SCHEDULE", payload);
    this.API_refresh_time = Date.now();
  },

  notificationReceived(notification, payload) {
    if (notification === "UPDATE_BUS_SCHEDULE") {
      this.busSchedule = payload;
      this.updateDom();
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
    // Create the main container div
    const container = document.createElement('div');
    container.style.display = 'grid'; // Use grid for layout
    container.style.fontSize = this.config.fontsize; // Set font size

    // Show bus times
    let i = 0;
    let j = 0;
    while (i < this.busSchedule.length && j < this.config.displayed_entries) {

      if (Math.round((this.busSchedule[i].departure_time - Date.now()/1000) / 60) < 2) {
        i++;
        continue;
      }

      const busTimeContainer = document.createElement('div');
      busTimeContainer.style.marginRight = '10px'; // Add some spacing between bus times

      const routeInfo = document.createElement("p");
      routeInfo.style.margin = '0';
      routeInfo.style.color = 'white'; // Set color to white
      routeInfo.style.display = 'flex'; // Use flexbox to align items
      routeInfo.style.justifyContent = 'space-between'; // Distribute space between items

      const routeName = document.createElement('span');
      routeName.style.textAlign = 'left';
      routeName.textContent = this.busSchedule[i].route_short_name;

      const departureTime = document.createElement('span');
      departureTime.style.textAlign = 'right';
      departureTime.style.color = 'green'; // Set color to white
      departureTime.textContent = Math.round((this.busSchedule[i].departure_time - Date.now()/1000) / 60) + " min";

      routeInfo.appendChild(routeName);
      routeInfo.appendChild(departureTime);

      busTimeContainer.appendChild(routeInfo);

      container.appendChild(busTimeContainer);
      i++;
      j++;
    }

    // Create the image element
    
    const transitlogo = document.createElement('img');
    transitlogo.src = 'modules/MMM-TransitApp/Images/transit-api-badge.png';
    transitlogo.alt = 'Transit logo';
    transitlogo.style.height = this.config.logosize;
    transitlogo.style.objectFit = 'contain';

    container.appendChild(transitlogo);
    

    return container;
  },

  refreshSchedule() {
    // Implement the refresh logic here
  }

});
