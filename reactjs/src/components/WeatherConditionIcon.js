/**
 * Load weather condition icon specified by condition prop.
 * https://openweathermap.org/weather-conditions
 */
export default function WeatherConditionIcon(props) {

	return <>
		<img src={'http://openweathermap.org/img/wn/' + (props.condition.icon) + '@2x.png'} />
		<span>{props.condition.main}</span>
	</>;

}