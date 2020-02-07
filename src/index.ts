import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import user from './controllers/user'

const appInit = function() {
	const app: Application = express()
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(morgan('dev'))

	app.listen(process.env.SERVER_PORT, () => {
		console.log('Server running...')
	})
	return app
}

const connectMongoDb = function() {
	mongoose.connect(process.env.MONGO_URI!, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	const db = mongoose.connection
	db.on('error', console.error.bind(console, 'connection error: '))
	db.once('open', function() {
		console.log('Mongodb connected...')
	})
}

const registeRouters = function(app: Application): void {
	app.use('/users', user)

	app.get('/*', (req: Request, res: Response) => {
		res.send('This is a server, not for vistors...')
	})
}

const __main = function() {
	dotenv.config()
	const app = appInit()
	connectMongoDb()
	registeRouters(app)
}

__main()