import React, { useState } from 'react';
import './App.css';

import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

function App() {
	var headers = new Headers();
	headers.append("x-access-token", process.env.REACT_APP_API_KEY || "");
	headers.append("Content-Type", "application/json");

	const requestOptions: RequestInit = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	const [latitude, setLatitude] = useState<number>(0.00);
	const [longitude, setLongitude] = useState<number>(0.00);
	const [uvIndex, setUvIndex] = useState<number>(0.00);

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
					<div className="flex-auto">
						<label htmlFor="latitude" className="font-bold block mb-2">Latitude (-90° to 90°):</label>
						<InputNumber inputId="latitude" value={latitude} min={-90} max={90} onValueChange={(e: InputNumberValueChangeEvent) => setLatitude(e.value || 0)} minFractionDigits={2} maxFractionDigits={5} />
					</div>

					<div className="flex-auto">
						<label htmlFor="longitude" className="font-bold block mb-2">Longitude (-180° to 180°):</label>
						<InputNumber inputId="longitude" value={longitude} min={-180} max={180} onValueChange={(e: InputNumberValueChangeEvent) => setLongitude(e.value || 0)} minFractionDigits={2} maxFractionDigits={5} />
					</div>
					
					<Button label='Go' onClick={getUV}/>
				</>
				
				<p>For Latitude = {latitude} and Longitude = {longitude}</p>
				<p>Current UV Index = {uvIndex}</p>
			</header>
		</div>
	);
}

export default App;
