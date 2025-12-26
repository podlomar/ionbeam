import { createServer } from 'ionbeam';
import { HomePage } from './pages/HomePage/index.js';

const app = createServer();

app.get('/', async (req, res) => {
  await req.ionbeam.renderPage("Home", <HomePage />);
});

app.get('/about', async (req, res) => {
  await req.ionbeam.renderPage("About", <div>About Page</div>);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
