import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => {
  console.log(`Server listening on http://localhost:${PORT}`);
});