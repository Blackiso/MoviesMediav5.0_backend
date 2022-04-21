import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Controller, Get, ClassErrorMiddleware } from '@overnightjs/core';
import { errorHanddler } from '@Middleware/index';
import { ERRORS, RequestError } from '@Config/index';
import { TMDB } from '@Lib/TMDB';
import { MoviesService } from '@Services/MoviesService';
import { parseFilterQuery } from '@Helpers/index';


@injectable()
@Controller('api/v5/movies')
@ClassErrorMiddleware(errorHanddler)
export class MoviesController {

	private allowed_types:Array<string> = ['popular', 'upcoming', 'now_playing'];

	constructor(
		private tmdb:TMDB,
		private moviesService:MoviesService
	) {}

	@Get('discover/:type')
	public async discover(req:Request, res:Response, next:any) {
		try {

			if (!this.allowed_types.includes(req.params.type)) throw new RequestError(ERRORS.REQUEST_ERROR);
			let results = await this.tmdb.discover(req.params.type, req.query.page || 1);
			await this.moviesService.setMoviesCollection(results.results);
			return res.ok(results);

		}catch(e) {
			next(e);
		}
	}

	@Get('filter')
	public async filter(req:Request, res:Response, next:any) {
		try {

			let query = await parseFilterQuery(req.query, this.tmdb);
			let movies = await this.tmdb.filter(query);
			await this.moviesService.setMoviesCollection(movies.results);
			return res.ok(movies);

		}catch(e) {
			next(e);
		}
	}

	@Get('details/:id')
	public async movie(req:Request, res:Response, next:any) {
		try {		
			let movie = await this.tmdb.movie(req.params.id);
			await this.moviesService.setMoviesCollection([ movie ]);
			await this.moviesService.setMoviesCollection(movie.similar);
			return res.ok(movie);
		}catch(e) {
			next(e);
		}
	}

	@Get('search')
	public async search(req:Request, res:Response, next:any) {
		try {

			let movies;
			let query = await parseFilterQuery(req.query, this.tmdb);

			if ('with_keywords' in query) {
				movies = await this.tmdb.search(query.with_keywords, query.page ?? 1);
			}else {
				movies = await this.tmdb.filter(query);
			}

			await this.moviesService.setMoviesCollection(movies.results);
			
			return res.ok(movies);

		}catch(e) {
			next(e);
		}
	}

}