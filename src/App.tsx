import React, { useRef, useState } from 'react';
import './App.css';

import Logo from "./assets/images/logo.png";

import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';


import "primereact/resources/themes/saga-orange/theme.css";
import MapEmbed from './components/MapEmbed';

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
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetchedData, setHasFetchedData] = useState(false);
	const [isShowingError, setIsShowingError] = useState(false);

	const toast = useRef<Toast>(null);

	function showError(message: string = "Something went wrong") {
		setIsShowingError(true);
		setIsLoading(false);
		toast.current?.show({severity:'error', summary:'Error', detail: message, life: 10000});
	}

	async function fetchData() {
		setIsLoading(true);
		setHasFetchedData(false);
		try {
			const response = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}&alt=100&dt=`, requestOptions);
			if (!response.ok) {
				const error = new Error(`An error occurred while retrieving UV data: HTTP Status ${response.status} — Check your API key`);
				if (isShowingError) {
					showError(error.message);
				}
				throw error;
			}

			return await response.json();
		} catch (error: unknown) {
			console.error("Error fetching UV data: ", error);

			const message = error instanceof Error ? error.message : "An unknown error occurred";
			showError(message);
			return null;
		}
	}

	function getUV(e: React.FormEvent) {
		setIsShowingError(false);
		e.preventDefault();

		fetchData().then(data => {
			if (data?.result) {
				setUvIndex(data.result.uv);
				console.log("UV index: ", uvIndex);
				setIsLoading(false);
				setHasFetchedData(true);
			}
		})
	}

	const footer = "*All data is calculated at an altitude of 100m";

	return (
		<div className="App">
			<Toast ref={toast} position='top-center'/>

			<header className='header'>
				<img alt='logo' src={Logo} height={100}/>
				<h1>UV Index Finder</h1>
			</header>

			<div className='body'>
				<div className="input-field" >
					<label htmlFor="latitude" className="font-bold block mb-2">Latitude (-90° to 90°):</label>
					<InputNumber inputId="latitude" 
						data-testid="lat-input"
						value={latitude} 
						min={-90} 
						max={90} 
						onChange={e => setHasFetchedData(false)}
						onValueChange={(e: InputNumberValueChangeEvent) => {
							setLatitude(e.value || 0)}
						} 
						minFractionDigits={0} 
						maxFractionDigits={5} />
				</div>

				<div className="input-field">
					<label htmlFor="longitude" className="font-bold block mb-2">Longitude (-180° to 180°):</label>
					<InputNumber inputId="longitude" 
						data-testid="long-input"
						value={longitude} 
						min={-180} 
						max={180} 
						onChange={e => setHasFetchedData(false)}
						onValueChange={(e: InputNumberValueChangeEvent) => {
							setLongitude(e.value || 0)}
						} 
						minFractionDigits={0} 
						maxFractionDigits={5} />
				</div>
				
				<Button label='Go' onClick={getUV} loading={isLoading}/>

				{ hasFetchedData ? <Card className='uv-data' title="UV Data*" subTitle={`Latitude = ${latitude}, Longitude = ${longitude}`} footer={footer} >
					<p>Current UV Index = {uvIndex}</p>
					<MapEmbed latitude={latitude} longitude={longitude} />
					</Card> : <></>}
			</div>
			
		</div>
	);
}

export default App;
