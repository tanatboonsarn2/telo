import './config/env'; // Load and validate env vars first
import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${env.PORT}`);
});
