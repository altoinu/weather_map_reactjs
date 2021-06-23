//import logo from './logo.svg';
import './App.css';

import {
	BrowserRouter,
	HashRouter,
	Switch,
	Route,
	Link
} from "react-router-dom";

import CurrentTemperature from './pages/CurrentTemperature';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				{/*
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/}
				<BrowserRouter basename="/">
					<div className="mainContainer">
						{/* navigation */}
						<nav className="navContainer">
							<ul className="nav flex-column">
								<li className="nav-item">
									<Link className="nav-link"
										to="/">Current Temperature</Link>
								</li>
							</ul>
						</nav>
						{/* route and each "page" */}
						<div className="contentContainer">
							<Switch>
								<Route path="/" exact>
									<CurrentTemperature />
								</Route>
							</Switch>
						</div>
					</div>
				</BrowserRouter>
			</header>
		</div>
	);
}

export default App;
