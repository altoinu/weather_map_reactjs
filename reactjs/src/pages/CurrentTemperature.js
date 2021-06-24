import React from 'react';

/**
 * Display current temperature.
 */
export default class CurrentTemperature extends React.Component {

	constructor(props) {

		super(props);

	}

	render() {

		// Display temperature, "Loading..." if not available yet, or error message

		return (
			<div>
				<h5>Current Temperature: <span>{
					this.props.gpserror
						? 'Could not load weather information'
						: this.props.temp
							? this.props.temp + ' F'
							: 'Loading weather information...'
				}</span></h5>
			</div>
		);

	}

}