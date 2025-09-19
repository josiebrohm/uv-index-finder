interface MapProps {
	latitude: number;
	longitude: number;
}

export default function MapEmbed({ latitude, longitude} : MapProps) {
	const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

	return (
		<div className="map-embed">
			<iframe
				title="map"
				width="100%"
				height="100%"
				src={mapURL}
				allowFullScreen
			/>
		</div>
	)
}