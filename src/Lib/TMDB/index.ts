import { Movie } from './Movie';

export * from './TMDB';
export * from './Movie';
export * from './MovieDetails';

export interface MovieListResult {
    results:Array<Movie>;
    page:number;
    total_pages:number;
    total_results:number;
    dates:any;
}