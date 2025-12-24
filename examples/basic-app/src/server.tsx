import { createServer } from 'ioncore';
import { HomePage } from './pages/HomePage/index.js';

const app = createServer();

app.get('/', async (req, res) => {
  await req.ioncore.render(<HomePage request={req} />);
});

app.get('/about', async (req, res) => {
  await req.ioncore.render(<div>About Page</div>);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
