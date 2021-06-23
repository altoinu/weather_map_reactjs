import React from 'react';

/**
 * Display current temperature.
 */
export default class CurrentTemperature extends React.Component {

	constructor(props) {

		super(props);

	}

	render() {

		// Display temperature or "Loading..." if not available yet
		let tempDisplay = this.props.temp ? this.props.temp + ' F' : 'Loading weather information...';

		return (
			<div>
				<h5>Current Temperature: <span>{tempDisplay}</span></h5>
			</div>
		);

	}

}