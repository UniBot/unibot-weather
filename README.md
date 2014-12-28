# unibot-weather
Simple weather plugin for UniBot. This uses OpenWeatherMap API to fetch actual weather information.

## Install
To your UniBot application
```npm install git://github.com/UniBot/unibot-weather --save```

And after that register new plugin on IRC channels what you need
```plugin [#channel] weather```

ps. remember to restart your UnitBot.

## Configuration
You can configure this plugin adding ```weather``` section to your UniBot ```config.js``` file. Example below with
default values.

```
module.exports = { 
    ...
    plugins: {
        "weather": {
            "showFetchMessage": true,
            "units": "metric",
            "messages": {
                "fetch": "${nick} wait a moment fetching weather data for '${location}'...",
                "success": "${nick}: temperature: ${weather.main.temp}°C (min: ${weather.main.temp_min}°C, max: ${weather.main.temp_max}°C), wind speed: ${weather.wind.speed}m/s, ${weather.weather[0].main}: ${weather.weather[0].description}",
                "error": "${nick} cannot find any weather data for '${location}'..."
            }
        }
    }
};
```

### showFetchMessage
Show fetch message on channel or not.

### units
What units OpenWeatherMap will use. Following values are allowed:

 * ```internal``` http://api.openweathermap.org/data/2.5/find?q=London
 * ```metric``` http://api.openweathermap.org/data/2.5/find?q=London&units=metric
 * ```imperial``` http://api.openweathermap.org/data/2.5/find?q=London&units=imperial

### messages.fetch
Message that is shown on channel when plugin starts to fetch weather data. Note that this can be disabled. Following
template variables are available with this message.

```
nick
location
```

### messages.success
Message that is shown on channel after successfully weather data fetch. Following template variables are available with
this message.

```
nick
location
weather.*
```

Where weather contains all the data from OpenWeatherMap API, you can see an example result with following URL
http://api.openweathermap.org/data/2.5/find?units=metric&q=Jyv%C3%A4skyl%C3%A4 note that plugin will iterate each items
from ```list``` key and sends messages from each to specified channel.

### messages.error
Message that is shown on channel if plugin cannot find any weather data for specified location. Following template
variables are available with this message.

```
nick
location
```

## Usage
After installation just type ```!weather [location]``` on the IRC channel. 