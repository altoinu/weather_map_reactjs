import { API_KEY } from '../constants/OpenWeatherAPI';

class OpenWeatherMapService {

	logPrefix = 'OpenWeatherMapService';

	/**
	 * Load current weather at specified geo coordinates.
	 */
	getCurrentWeather(lat, lon) {

		console.log(this.logPrefix, 'getCurrentWeather', lat, lon);

		// https://openweathermap.org/current
		// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
		//const url = new URL('http://localhost:4000/currentTemperature');
		const url = new URL('http://api.openweathermap.org/data/2.5/weather');
		const params = {
			appid: API_KEY,
			lat: lat,
			lon: lon,
			units: 'imperial'
		};
		url.search = new URLSearchParams(params).toString();

		console.log(url);

		return fetch(url, {
			method: 'GET',
			//mode: 'cors',
		}).then((response) => {

			console.log(this.logPrefix, 'getCurrentWeather success', response);
			return response.json();

		}).then((result) => {

			console.log(this.logPrefix, 'getCurrentWeather result', result);
			return result;

		}).catch((error) => {

			console.error(this.logPrefix, 'getCurrentWeather error', error);
			return Promise.reject(new Error(error));

		});

	}

	/**
	 * Load 5 day weather at specified geo coordinates.
	 */
	get5DayWeather(lat, lon) {

		console.log(this.logPrefix, 'get5DayWeather', lat, lon);

		// https://openweathermap.org/forecast5
		// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
		const url = new URL('http://api.openweathermap.org/data/2.5/forecast');
		const params = {
			appid: API_KEY,
			lat: lat,
			lon: lon,
			units: 'imperial'
		};
		url.search = new URLSearchParams(params).toString();

		console.log(url);

		return fetch(url, {
			method: 'GET',
			//mode: 'cors',
		}).then((response) => {

			console.log(this.logPrefix, 'get5DayWeather success', response);
			return response.json();

		}).then((result) => {

			console.log(this.logPrefix, 'get5DayWeather result', result);
			return result;

		}).catch((error) => {

			console.error(this.logPrefix, 'get5DayWeather error', error);
			return Promise.reject(new Error(error));

		});

	}

}

export default new OpenWeatherMapService();