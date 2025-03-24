# MMM-TransitApp

Before you begin,
1. Request an API key from Transit App.
2. Get the bus stop code using the `/public/nearby_stops` endpoint through a bash terminal.
```
sudo apt update
sudo apt install curl jq

# Replace YOUR_API_KEY, YOUR_LATITUDE and YOUR_LONGITUDE
# Set the latitude and longitude close to your bus stop.

curl  -H "Accept-Language:en" -H "apiKey:YOUR_API_KEY" "https://external.transitapp.com/v3/public/nearby_stops?lat=YOUR_LATITUDE&lon=YOUR_LONGITUDE" | jq
```
From the JSON response, make a note of the `"global_stop_id"` of your stop. It will be formatted as `"ABC:12345"`.


![Example of MMM-Template](./example_1.png)

[Module description]

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-Template:

```bash
cd ~/MagicMirror/modules
git clone [GitHub url]
```

### Update

```bash
cd ~/MagicMirror/modules/MMM-Template
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'MMM-Template',
        position: 'lower_third'
    },
```

Or you could use all the options:

```js
    {
        module: 'MMM-Template',
        position: 'lower_third',
        config: {
            exampleContent: 'Welcome world'
        }
    },
```

## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`exampleContent`|`string`|not available|The content to show on the page

## Sending notifications to the module

Notification|Description
------|-----------
`TEMPLATE_RANDOM_TEXT`|Payload must contain the text that needs to be shown on this module

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
