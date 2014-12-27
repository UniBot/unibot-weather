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
     *                  fetchData: string,
     *                  success: string
     *              }
     *          }}
     */
    var pluginConfig = {
        "showFetchMessage": true,
        "messages": {
            "fetchData": "${nick} wait a moment fetching weather data for '${location}'...",
            "success": "${nick}: temperature: ${weather.main.temp}°C (min: ${weather.main.temp_min}°C, max: ${weather.main.temp_max}°C), wind speed: ${weather.wind.speed}m/s, ${weather.weather[0].main}: ${weather.weather[0].description}"
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
            if (pluginConfig.showFetchMessage) {
                var templateVars = {
                    nick: from,
                    location: location
                };

                channel.say(_.template(pluginConfig.messages.fetchData, templateVars));
            }

            helpers.download('http://api.openweathermap.org/data/2.5/find?units=metric&q=' + location, function(data) {
                data = JSON.parse(data);

                var templateVars = {
                    location: location,
                    weather: data.list[0]
                };

                channel.say(_.template(pluginConfig.messages.success, templateVars));
            });
        }

        return {
            '^!weather (.+)': function(from, matches) {
                getWeather(matches[1], from);
            }
        };
    }
};