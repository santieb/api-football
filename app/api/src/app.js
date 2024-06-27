import routes from './routes.js'
import dbConnect from './config/database.js'
import ExpressConfig from './config/express.config.js'
import config from './config/config.js'
const { PORT } = config

const app = ExpressConfig()

const connection = dbConnect();
app.use((req, res, next) => {
  req.dbConnection = connection
  next()
})
app.use('/', routes)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
