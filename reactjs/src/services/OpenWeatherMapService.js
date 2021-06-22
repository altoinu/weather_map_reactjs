import { API_KEY } from '../constants/OpenWeatherAPI';

class OpenWeatherMapService {

	logPrefix = 'OpenWeatherMapService';

	getCurrentWeather(lat, long) {

		console.log(this.logPrefix, 'getCurrentWeather', lat, long);

		// https://openweathermap.org/current
		// //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
		const url = new URL('http://api.openweathermap.org/data/2.5/weather');
		//const url = new URL('http://localhost:4000/currentTemperature');
		const params = {
			appid: API_KEY,
			lat: lat,
			lon: long
		};

		url.search = new URLSearchParams(params).toString();

		console.log(url);

		fetch(url, {
			method: 'GET',
			mode: 'cors',
		}).then((response) => {

			console.log(this.logPrefix, 'getCurrentWeather success', response);
			return response.json();

		}).then((result) => {

			console.log(this.logPrefix, 'getCurrentWeather result', result);

		});

	}

}

export default new OpenWeatherMapService();