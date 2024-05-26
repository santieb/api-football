import routes from './routes.js'
import dbConnect from './config/database.js'
import ExpressConfig from './config/express.config.js'
import config from './config/config.js'
const { PORT } = config

const app = ExpressConfig()

try {
  dbConnect();
  console.log('🗂️  Database connected successfully');
} catch (err) {
  console.error(err);
}

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
