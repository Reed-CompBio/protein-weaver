import { config } from 'dotenv'

// Load config from .env
config()

export const API_PREFIX = process.env.API_PREFIX || '/api'
export const APP_PORT = process.env.APP_PORT || 3000
export const NEO4J_URI = process.env.NEO4J_URI
export const NEO4J_USERNAME = process.env.NEO4J_USERNAME
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
export const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH;
export const SECRET_KEY = process.env.SECRET_KEY;
