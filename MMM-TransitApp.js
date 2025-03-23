Module.register("MMM-TransitApp", {

  defaults: {
    logosize:"30px",
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["transitapp.css"]
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.templateContent = this.config.exampleContent

    // set timeout for next random text
    setInterval(() => this.addRandomText(), 3000)
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data`returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "EXAMPLE_NOTIFICATION") {
      this.templateContent = `${this.config.exampleContent} ${payload.text}`
      // this.updateDom()
    }
  },

  /**
   * Original template   
  getDom() {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `<b>Title</b><br />${this.templateContent}`

    return wrapper
  },
  */

  getDom() {
    // Create the main container div
    const container = document.createElement('div');
    container.style.display = 'flex'; // Use flexbox for layout
    container.style.alignItems = 'center'; // Vertically align items
  
    // Create the image element
    const transitlogo = document.createElement('img');
    transitlogo.src = 'modules/MMM-TransitApp/Images/transit-api-badge.png';
    transitlogo.alt = 'Transit logo';
    transitlogo.style.height = this.config.logosize;
    transitlogo.style.objectFit = 'contain';
    
    transitlogo.style.marginRight = '20px'; // Add some spacing between image and text

    const buslogo = document.createElement('img');
    buslogo.src = 'modules/MMM-TransitApp/Images/bus-logo.png';
    buslogo.alt = 'Bus logo';
    buslogo.style.height = this.config.logosize;
    buslogo.style.objectFit = 'contain';
    
  
    // Create the text element
    const textElement = document.createElement('div');
    textElement.textContent = 'FF1';
  
    // Append the image and text to the container
    container.appendChild(transitlogo);
    container.appendChild(buslogo);
    //container.appendChild(textElement);
  
    return container;
  },

  addRandomText() {
    this.sendSocketNotification("GET_RANDOM_TEXT", { amountCharacters: 15 })
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    if (notification === "TEMPLATE_RANDOM_TEXT") {
      this.templateContent = `${this.config.exampleContent} ${payload}`
      this.updateDom()
    }
  }
})
