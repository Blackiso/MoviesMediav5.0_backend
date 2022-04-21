import { Logger } from '@overnightjs/logger';

export * from './RequestError';

export const DEFAULT_IMAGE = 'default.png';
export const PAGE_LIMIT = 20;

export const MYSQL = {
	host: '127.0.0.1',
	user: 'root',
	password: '3uae67Kydl01',
	// password: 'root',
	database: 'moviesmedia_database'
}

export const ERRORS = {
	AUTH_USERNAME_USED: 'Username already used',
	AUTH_EMAIL_USED: 'Email already used',
	AUTH_LOGIN: 'Wrong username or password!',
	AUTH_FAILD: 'Authentication faild!',
	REQUEST_ERROR: 'Invalid request, please try again later',
	TOKEN_ERROR: 'Invalid JWT token!',
	DEFAULT_INPUT_ERROR: 'Invalid input!'
}

export const FILTER = {
	year: 'primary_release_year',
	cast: 'with_cast',
	genres: 'with_genres',
	keyword: 'with_keywords',
	vote: 'vote_average.gte',
	page: 'page'
}

export const COLLECTION_FILTER = {
	year: (x) => {
		return "m.year = "+x;
	},
	cast: (x) => {
		return "m.actor_data like '%"+x.replace(' ', '%')+"%'";
	},
	genres: (x) => {
		return "m.genres_ids like '%"+x.split(',').join('%')+"%'";
	},
	vote: (x) => {
		return "m.vote_average > "+x;
	}
}

export const COLLECTION_ORDER = {
	NF: 'c.added_at DESC',
	OF: 'c.added_at ASC',
	YD: 'm.release_date DESC',
	YA: 'm.release_date ASC'
}

export const TMDB_KEY = '1836b7fa49fccf1fd2ed0be57c06209c';
export const TMDB_URLS = {
	movie: 'https://api.themoviedb.org/3/movie/:x',
	discover: 'https://api.themoviedb.org/3/movie/:x',
	filter: 'https://api.themoviedb.org/3/discover/movie',
	search: 'https://api.themoviedb.org/3/search/movie',
	people: 'https://api.themoviedb.org/3/search/person',

	getURL: function (type, porp, querys = {}) {	
		let url = this[type];
		if (porp !== null) url = url.replace(':x', porp);

		url += '?api_key='+TMDB_KEY;

		for (let k in querys) {
			url += '&'+k+'='+encodeURIComponent(querys[k]);
		}

		Logger.Imp('TMDB Request sent to: '+url);

		return url;
	}
}