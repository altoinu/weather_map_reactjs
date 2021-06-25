import React from 'react';

import './FiveDayTemperatures.css';

import WeatherConditionIcon from '../components/WeatherConditionIcon';

/**
 * Display 5 day temperatures in row/col format.
 */
export default class FiveDayTemperatures extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			fivedayforecast: null
		};

	}

	/*
	componentDidMount() {

		//alert('FiveDayTemperatures componentDidMount');
		//console.log('---', this.props);
		this.setState((state, props) => ({
			fivedayforecast: props.forecast
		}));

	}
	*/

	getCurrentMonthInString(date) {

		let currentMonth = date.getMonth() + 1;

		if (currentMonth < 10)
			return 0 + currentMonth.toString();
		else
			return currentMonth.toString();

	}

	render() {

		let contents;

		if (this.props.gpserror) {

			// gps error
			contents = <div className="row">
				<div className="col">
					Could not load weather information
				</div>
			</div>;

		} else if (!this.props.forecast || (this.props.forecast.length == 0)) {

			console.log(this.state);

			// forcast data still needs to be loaded
			contents = <div className="row">
				<div className="col">
					Loading weather information...
				</div>
			</div>;

		} else {

			// forcast data loaded

			let parsedForcast = this.props.forecast.reduce((day, currentforcast) => {

				let currentForcastDate = new Date(currentforcast.dt_txt);
				let currentDateString = currentForcastDate.getFullYear().toString() + this.getCurrentMonthInString(currentForcastDate) + currentForcastDate.getDate().toString();

				//console.log(currentDateString);

				if (!day.hasOwnProperty(currentDateString))
					day[currentDateString] = [];

				let thisDateObject = day[currentDateString];
				thisDateObject.push(currentforcast);

				return day;

			}, {});

			//console.log('parsedForcast', parsedForcast);

			let forcastContents = [];

			for (let d in parsedForcast) {

				console.log(parsedForcast[d]);
				forcastContents.push({
					id: d,
					content: parsedForcast[d].map((item) => {

						return <div key={item.dt}
							className="row">
							<div className="col">
								{item.dt_txt}
							</div>
							<div className="col">
								{item.main.temp} F
												</div>
							<div className="col">
								<WeatherConditionIcon
									condition={item.weather[0]} />
							</div>
						</div>;

					})
				});

			}

			console.log('forcastContents', forcastContents);

			// format it into rows and columns
			contents = <>
				<div className="row">
					<div className="col">
						Date and Time
							</div>
					<div className="col">
						Temperature
							</div>
					<div className="col">
						Weather Condition
								</div>
				</div>
				{forcastContents && forcastContents.map((content) => {
					return <div key={content.id}
						style={{
							'border-bottom': '5px solid red'
						}}>
						{content.content}
					</div>;
				})}
				{/*
				this.props.forecast.map((item) => {
					return <div key={item.dt}
						className="row">
						<div className="col">
							{item.dt_txt}
						</div>
						<div className="col">
							{item.main.temp} F
									</div>
						<div className="col">
							<WeatherConditionIcon
								condition={item.weather[0]} />
						</div>
					</div>;
				})
				*/}
			</>;

		}
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h5>5 Day Temparatures</h5>
					</div>
				</div>
				{ contents}
			</div>
		);

	}

}
