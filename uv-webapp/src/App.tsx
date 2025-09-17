import React, { useState } from 'react';
import './App.css';

function App() {
	var headers = new Headers();
	headers.append("x-access-token", "openuv-y2rmfnz6v6r-io");
	headers.append("Content-Type", "application/json");

	const requestOptions: RequestInit = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [uvIndex, setUvIndex] = useState(0);

	async function fetchData() {
		try {
			const response = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}&alt=100&dt=`, requestOptions);
			if (!response.ok) {
				throw new Error(`HTTP Error: Status ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching UV data: ", error);
			return null;
		}
	}

	function getUV(e: React.FormEvent) {
		e.preventDefault();

		fetchData().then(data => {
			if (data?.result) {
				setUvIndex(data.result.uv);
				console.log("UV index: ", uvIndex);
			}
		})
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>UV Index Finder</h1>
				<>
					<label>
						Latitude (-90° to 90°):
						<input name='latitude' type='number' value={latitude} min={-90} max={90} onChange={(e) => setLatitude(+e.target.value)}/>
					</label>
					
					<label>
						Longitude (-180° to 180°):
						<input name='longitude' type='number' value={longitude} min={-180} max={180}  onChange={(e) => setLongitude(+e.target.value)}/>
					</label>
					
					<button type='submit' onClick={getUV}>Go</button>
				</>
				
				<p>current uv index: {uvIndex}</p>
			</header>
		</div>
	);
}

export default App;
