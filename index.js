/**
 * Plugin dependencies.
 *
 * @type {exports}
 */
var _ = require('lodash');
var helpers = require('unibot-helpers');

/**
 * Weather plugin for UniBot.
 *
 * This plugin fetches weather data from http://api.openweathermap.org API.
 *
 * @param  {Object} options Plugin options object, description below.
 *   db: {mongoose} the mongodb connection
 *   bot: {irc} the irc bot
 *   web: {connect} a connect + connect-rest webserver
 *   config: {object} UniBot configuration
 *
 * @return  {Function}  Init function to access shared resources
 */
module.exports = function init(options) {
    var config = options.config;

    /**
     * Default plugin configuration. These can be override on your UniBot config.js file
     *
     * @type    {{
     *              showFetchMessage: boolean,
     *              messages: {
     *                  fetch: string,
     *                  success: string,
     *                  error: string
     *              }
     *          }}
     */
    var pluginConfig = {
        "showFetchMessage": true,
        "messages": {
            "fetch": "${nick}: wait a moment fetching weather data for '${location}'...",
            "success": "${nick}: temperature: ${weather.main.temp}°C (min: ${weather.main.temp_min}°C, max: ${weather.main.temp_max}°C), wind speed: ${weather.wind.speed}m/s, ${weather.weather[0].main}: ${weather.weather[0].description}",
            "error": "${nick}: cannot find any weather data for '${location}'..."
        }
    };

    // Merge configuration for plugin
    if (!_.isUndefined(config.plugins) && !_.isUndefined(config.plugins.weather) && _.isObject(config.plugins.weather)) {
        pluginConfig = _.merge(pluginConfig, config.plugins.weather);
    }

    /**
     * Actual UniBot weather plugin implementation. This plugin will fetch weather data from OpenWeatherMap API
     * according to given city name.
     */
    return function plugin(channel) {
        /**
         * Actual function to fetch weather data for specified location.
         *
         * @param   {string}    location
         * @param   {string}    from
         */
        function getWeather(location, from) {
            var templateVars = {
                nick: from,
                location: location
            };

            if (pluginConfig.showFetchMessage) {
                channel.say(_.template(pluginConfig.messages.fetch, templateVars));
            }

            // Fetch weather data from OpenWeatherMap API
            helpers.download('http://api.openweathermap.org/data/2.5/find?units=metric&q=' + location, function(data) {
                var weatherData = JSON.parse(data);

                if (weatherData.count == 0) {
                    channel.say(_.template(pluginConfig.messages.error, templateVars));
                } else {
                    _.each(weatherData.list, function iterator(data) {
                        templateVars.weather = data;

                        channel.say(_.template(pluginConfig.messages.success, templateVars));
                    });
                }
            });
        }

        return {
            '^!weather (.+)': function(from, matches) {
                getWeather(matches[1], from);
            }
        };
    }
};
