import React from 'react';

import './FiveDayTemperatures.css';

import WeatherConditionIcon from '../components/WeatherConditionIcon';

/**
 * Display 5 day temperatures in row/col format.
 */
export default class FiveDayTemperatures extends React.Component {

	constructor(props) {

		super(props);

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

			// forcast data still needs to be loaded
			contents = <div className="row">
				<div className="col">
					Loading weather information...
				</div>
			</div>;

		} else {

			// forcast data loaded

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
				{this.props.forecast.map((item) => {
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
				})}
			</>;

		}
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h5>5 Day Temparatures</h5>
					</div>
				</div>
				{ contents }
			</div>
		);

	}

}
