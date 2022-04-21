interface MovieCollection {
	watched:boolean;
	watchlist:boolean;
}

export class Movie {

	public id:number;
	public title:string;
	public poster_path:string;
	public vote_average:number | null;
	public release_date:number;
	public backdrop_path:string | null;
	public overview:string | null;
	public collection:MovieCollection = {
		watched: false,
		watchlist: false
	};

	constructor (data:any) {
		this.id = data.id;
		this.title = data.title;
		this.poster_path = data.poster_path;
		this.vote_average = data.vote_average || null;
		this.release_date = data.release_date;
		this.overview = data.overview || null;
		this.backdrop_path = data.backdrop_path || null;
		this.release_date = typeof data.release_date === 'string' ? Date.parse(data.release_date) : data.release_date;
		this.setCollection(data);
	}

	public setCollection(collection:MovieCollection) {
		this.collection.watched = collection.watched ? true : false;
		this.collection.watchlist = collection.watchlist ? true : false;
	}

}