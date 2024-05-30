import express from 'express'
import helmet from 'helmet'
import path from 'path'
import { __dirname } from './config.js'

const ExpressConfig = () => {
  const app = express()

  const staticPath = path.join(__dirname, '../public');
  const viewsPath = path.join(__dirname, '../views');
  
  app.set('view engine', 'ejs');
  app.set('views', viewsPath);

  app.use(express.static(staticPath));
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(helmet())

  return app
}

export default ExpressConfig
