import { Router } from 'express'
import { getDriver } from '../src/neo4j.js'
import MovieService from '../services/movie.service.js'

const router = new Router()

router.get("/test", (req,res) =>{
  res.json({"message": "Successfully connected to the backend API"})
})

router.get('/getMovie', async (req, res, next) => {
    try {

      const movieService = new MovieService(
        getDriver()
      )

      const movies = await movieService.getMovie(
      )

      res.json(movies)
    }
    catch (e) {
      next(e)
    }
  })

export default router
