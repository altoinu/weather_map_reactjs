import React from 'react';

export default class FiveDayTemperatures extends React.Component {

	constructor(props) {

		super(props);

	}

	render() {

		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h5>5 Day Temparatures</h5>
					</div>
				</div>
				{/* forcast list */}
				{ this.props.forecast && (this.props.forecast.length > 0) &&
					<>
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
									{item.weather[0].main}
								</div>
							</div>;
						})}
					</>
				}
			</div>
		);

	}

}
