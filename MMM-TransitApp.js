Module.register("MMM-TransitApp", {

  defaults: {
    logosize: "30px",
    global_stop_id: "",
    apiKey: "",
  },

  getStyles() {
    return ["transitapp.css"];
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.busSchedule = [
      { route_short_name: "FF1", departure_time: "1742802299904" },
      { route_short_name: "FF2", departure_time: "1742802295652" },
      { route_short_name: "FF1", departure_time: "1742802299565" },
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

    // Show bus times
    for (let i = 0; i < Math.min(this.busSchedule.length, 3); i++) {
      const busTimeContainer = document.createElement('div');
      busTimeContainer.style.marginRight = '10px'; // Add some spacing between bus times

      const routeInfo = document.createElement("p");
      routeInfo.style.margin = '0';
      routeInfo.style.color = 'white'; // Set color to white
      routeInfo.textContent = `${this.busSchedule[i].route_short_name} :     ${Math.round((this.busSchedule[i].departure_time - Date.now()/1000) / 60)} min`; // Calculate the time until departure in minutes
      busTimeContainer.appendChild(routeInfo);

      container.appendChild(busTimeContainer);
    }

    // Create the image element
    /*
    const transitlogo = document.createElement('img');
    transitlogo.src = 'modules/MMM-TransitApp/Images/transit-api-badge.png';
    transitlogo.alt = 'Transit logo';
    transitlogo.style.height = this.config.logosize;
    transitlogo.style.objectFit = 'contain';

    container.appendChild(transitlogo);
    */

    return container;
  },

  refreshSchedule() {
    // Implement the refresh logic here
  }

});
