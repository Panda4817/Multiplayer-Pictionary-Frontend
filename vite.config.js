import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		plugins: [react()],
		server: {
			port: 3000
		},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./src/setupTests.jsx'],
		}
	}
})