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
			gpsStatus: '',
			latitude: null,
			longitude: null,
			temp: null
		};

	}

	loadWeather(lat, long) {

		console.log('CurrentTemperature, loadWeather', lat, long);

		OpenWeatherMapService.getCurrentWeather(lat, long).then((result) => {

			console.log('loadWeather complete', result);

			this.setState({
				temp: result.main.temp
			});

		}).catch((error) => {

			alert('Error loading weather information. Please try again later.');

		});

	}

	componentDidMount() {

		// get current location on component mount

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

				// load weather using lat/long
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
											<FiveDayTemperatures />
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
