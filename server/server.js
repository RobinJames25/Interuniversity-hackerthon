import express from 'express';
import authRouter from './routes/auth.route.js'
import uploadRouter from './routes/upload.routes.js';
import storyRouter from './routes/story.routes.js';
import 'dotenv/config';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/api/v1', authRouter);
app.use('/api/v1', uploadRouter);
app.use('/api/v1', storyRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to InterUniversity hackerthon root path'});
})

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})