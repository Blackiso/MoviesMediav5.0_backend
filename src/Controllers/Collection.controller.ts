import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Controller, Get, Post, ClassErrorMiddleware, ClassMiddleware } from '@overnightjs/core';
import { Validator } from '@Validator/Validator';
import { Logger } from '@overnightjs/logger';
import { errorHanddler, authentication } from '@Middleware/index';
import { Movie, TMDB } from '@Lib/TMDB';
import { CollectionModel, MovieData, MovieModel } from '@Models/index';
import { RequestError } from '@Config/RequestError';
import { ERRORS } from '@Config/index';
import { parseCollectionFilterQuery } from '@Helpers/index';


@injectable()
@Controller('api/v5/collection')
@ClassMiddleware(authentication)
@ClassErrorMiddleware(errorHanddler)
export class CollectionController {

	constructor(
		private tmdb:TMDB,
        private validator:Validator,
		private movieModel:MovieModel,
		private collectionModel:CollectionModel
	) {}

    @Post('')
	private async add(req:Request, res:Response, next:any) {
    
        try {

			let requestBody = req.body;

            if (!this.validator.run('collection_add', requestBody)) {
                return res.error(this.validator.getErrors(), 400);
            }

			if(!(await this.movieModel.check(requestBody.id))) {
				Logger.Info('Adding new movie ID: '+requestBody.id);
				let movieData = await this.tmdb.movie(requestBody.id);

				let movie:MovieData = {
					movie_id: movieData.id,
					title: movieData.title,
					poster_path: movieData.poster_path,
					release_date: movieData.release_date,
					runtime: movieData.runtime,
					ratings: movieData.ratings,
					vote_average: movieData.vote_average,
					director_id: movieData.directors[0].id || null,
					director_data: JSON.stringify(movieData.directors[0]),
					actor_id: movieData.cast[0].id || null,
					actor_data: JSON.stringify(movieData.cast[0]),
					year: new Date(movieData.release_date).getFullYear(),
					genres_ids: movieData.genres_ids
				}
				
				await this.movieModel.insert(movie);
			}

			await this.collectionModel.updateCollection({
				id: req.user.id+'-mv-'+requestBody.id,
				movie_id: requestBody.id,
				watched: requestBody.watched,
				watchlist: requestBody.watchlist,
				user_id: req.user.id
			});
            
			return res.ok(requestBody);

		}catch(e) {
			next(e);
		}
        
    } 

	@Get(':type')
	public async all(req:Request, res:Response, next:any) {
		try {

			let page:number = 1;
			if (typeof req.query.page == 'string' || typeof req.query.page == 'number') {
				page = parseInt(req.query.page);
			}

			let type:string | null = req.params.type !== 'watched' && req.params.type !== 'watchlist' ? null : req.params.type;
			if (type == null) throw new RequestError(ERRORS.DEFAULT_INPUT_ERROR, 400);

			let result = await this.collectionModel.getCollection(req.user, type, page, req.query);
			let total = await this.collectionModel.getTotalPages();

			return res.ok({
				page: page,
				results: result,
				total_pages: total.pages,
				total_results: total.total,
			});

		}catch(e) {
			next(e);
		}
	}

}