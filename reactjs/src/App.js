import React from 'react';

import './App.css';

import {
	BrowserRouter,
	HashRouter,
	Switch,
	Route,
	Link
} from "react-router-dom";

import OpenWeatherMapService from './services/OpenWeatherMapService';

import CurrentTemperature from './pages/CurrentTemperature';
import FiveDayTemperatures from './pages/FiveDayTemperatures';

export default class App extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			// status message
			gpsStatus: '',
			// gps coords
			latitude: null,
			longitude: null,
			// current temperature
			temp: null,
			// 5 day forecast
			fiveday: null
		};

	}

	loadWeather(lat, long) {

		console.log('loadWeather', lat, long);

		OpenWeatherMapService.getCurrentWeather(lat, long).then((result) => {

			console.log('loadWeather complete', result);

			// Remember current temperature
			this.setState({
				temp: result.main.temp
			});

		}).catch((error) => {

			alert('Error loading weather information. Please try again later.');

		});

	}

	load5dayWeather(lat, long) {

		console.log('load5dayWeather', lat, long);

		OpenWeatherMapService.get5DayWeather(lat, long).then((result) => {

			console.log('load5dayWeather complete', result);

			// Remember 5 day forcast list
			this.setState({
				fiveday: result.list
			});

		}).catch((error) => {

			alert('Error loading 5 day weather information. Please try again later.');

		});

	}

	componentDidMount() {

		// get current location on component mount

		if (!navigator.geolocation) {

			// GPS unavailable or user refused access

			console.error('CurrentTemperature, gps not supported');

			this.setState({
				gpsStatus: 'Geolocation is not supported by your browser'
			});

		} else {

			// GPS available

			console.log('CurrentTemperature, gps...');

			this.setState({
				gpsStatus: 'Locating…'
			});

			// Get coordinates
			navigator.geolocation.getCurrentPosition((position) => {

				// Remember latitude and longitude
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				this.setState({
					gpsStatus: 'Your Location',
					latitude: latitude,
					longitude: longitude
				});

				// load current weather using lat/long
				this.loadWeather(latitude, longitude);

				// load 5 day weather using lat/long
				this.load5dayWeather(latitude, longitude);

			}, () => {

				// Error loading GPS coordinates

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
			'justifyContent': 'center',
			'alignItems': 'center'
		};

		const locationContainerCSS = {
			display: this.state.latitude ? 'block' : 'none'
		};

		return (
			<div className="App">
				<header className="App-header">
					<BrowserRouter basename="/">
						<div className="mainContainer">
							{/* navigation */}
							<nav className="navContainer">
								<ul className="nav flex-column">
									<li className="nav-item">
										<Link className="nav-link"
											to="/">Current Temperature</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link"
											to="/5day">5 Day Temperatures</Link>
									</li>
								</ul>
							</nav>
							{/* main contents */}
							<div className="contentContainer">
								<div className="container">
									<div className="row">
										<div className="col">
											<h2>Weather Forcast Application</h2>
										</div>
									</div>
									{/* GPS location display */}
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
									{/* route and each "page" */}
									<Switch>
										<Route path="/" exact>
											<CurrentTemperature
												temp={this.state.temp} />
										</Route>
										<Route path="/5day" exact>
											<FiveDayTemperatures
												forecast={this.state.fiveday} />
										</Route>
									</Switch>
								</div>
							</div>
						</div>
					</BrowserRouter>
				</header>
			</div>
		);

	}
}
