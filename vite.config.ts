import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	resolve: {
		alias: {
			'@utils': '/src/utils.ts',
			'@images': '/edited',
			'@storage': '/src/storage.ts',
		},
	},
})
