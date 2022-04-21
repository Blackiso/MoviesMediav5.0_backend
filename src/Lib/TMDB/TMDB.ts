import { RequestError, TMDB_URLS } from '@Config/index';
import { Movie, MovieDetails, MovieListResult } from './index';
import axios from 'axios';

export class TMDB {

	public movie(id:string):Promise<MovieDetails> {
		return axios.get(TMDB_URLS.getURL('movie', id, { append_to_response: 'credits,videos,similar,release_dates' })).then(data => {
			if(data.data.success === false) throw new RequestError('Movie not found!', 400);
			return  new MovieDetails(data.data);
		});
	}

	public discover(type:string, page:any = 1):Promise<MovieListResult> {
		return axios.get(TMDB_URLS.getURL('discover', type, { page })).then(data => {
			data.data.results = this.parse(data.data.results);
			return data.data;
		});
	}

	public filter(query:any = {}):Promise<MovieListResult> {
		return axios.get(TMDB_URLS.getURL('filter', null, query)).then(data => {
			data.data.results = this.parse(data.data.results);
			return data.data;
		});
	}

	public search(keyword:string, page:any = 1):Promise<MovieListResult> {
		return axios.get(TMDB_URLS.getURL('search', null, { query: keyword, page: page })).then(data => {
			data.data.results = this.parse(data.data.results);
			return data.data;
		});
	}

	public people(keyword:string):Promise<Array<any>> {
		return axios.get(TMDB_URLS.getURL('people', null, { query: keyword })).then(data => {
			return data.data.results;
		});
	}

	private parse(dataList:Array<any>):Array<Movie> {
		let arr = [] as Array<any>;
		for (let i = 0; i < dataList.length; i++) {
			arr.push(new Movie(dataList[i]));
		}

		return arr;
	}
}