import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
    // Set this to your repository name
    base: '/EduNest/',
    plugins: [tailwind()],
});