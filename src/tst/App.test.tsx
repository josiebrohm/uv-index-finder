import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Location Input', () => {
	it('renders with initial values', () => {
		render(<App />);
		const latInput = screen.getByTestId("lat-input");
		expect(latInput).toHaveValue("0");
		const longInput = screen.getByTestId("long-input");
		expect(longInput).toHaveValue("0");
	})
	
	it('updates values on change', async () => {
		const user = userEvent.setup();
		render(<App />);

		const latInput = screen.getByTestId("lat-input");
		const longInput = screen.getByTestId("long-input");

		await user.type(latInput, "67.02{enter}");
		expect(latInput).toHaveValue("67.02");

		await user.type(longInput, "176.22{enter}");
		expect(longInput).toHaveValue("176.22");
	})

	it('limits input values to max when > max', async () => {
		const user = userEvent.setup();
		render(<App />);

		const latInput = screen.getByTestId("lat-input");
		const longInput = screen.getByTestId("long-input");

		await user.type(latInput, "1808080{enter}");
		expect(latInput).toHaveValue("90");

		await user.type(longInput, "1808080{enter}");
		expect(longInput).toHaveValue("180");
	})

	
});
