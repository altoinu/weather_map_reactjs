import React from 'react';

import OpenWeatherMapService from '../services/OpenWeatherMapService';

export default class CurrentTemperature extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			gpsStatus: '',
			latitude: null,
			longitude: null
		};

	}

	loadWeather(lat, long) {

		console.log('CurrentTemperature, loadWeather', lat, long);

		OpenWeatherMapService.getCurrentWeather(lat, long);

	}

	componentDidMount() {

		// get current location
		if (!navigator.geolocation) {

			console.error('CurrentTemperature, gps not supported');

			this.setState({
				gpsStatus: 'Geolocation is not supported by your browser'
			});

		} else {

			console.log('CurrentTemperature, gps...');

			this.setState({
				gpsStatus: 'Locating…'
			});

			navigator.geolocation.getCurrentPosition((position) => {

				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				this.setState({
					gpsStatus: 'Your Location',
					latitude: latitude,
					longitude: longitude
				});

				this.loadWeather(latitude, longitude);

			}, () => {

				this.setState({
					gpsStatus: 'Unable to retrieve your location',
					latitude: null,
					longitude: null
				});

			});

		}

	}

	render() {

		const statusContainerCSS = {
			display: 'flex',
			'justify-content': 'center',
			'align-items': 'center'
		};

		const locationContainerCSS = {
			display: this.state.latitude ? 'block' : 'none'
		};

		return (
			<div>
				<h2>Current Temperature</h2>
				<div className="container">
					<div className="row">
						<div className="col"
							style={statusContainerCSS}>
							<div>{this.state.gpsStatus}</div>
						</div>
						<div className="col"
							style={locationContainerCSS}>
							<div>Latitude: {this.state.latitude}</div>
							<div>Longitude: {this.state.longitude}</div>
						</div>
					</div>
				</div>
			</div>
		);

	}
}