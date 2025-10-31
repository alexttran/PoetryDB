import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private baseUrl = 'https://poetrydb.org';

  constructor(private http: HttpClient) { }

  searchByAuthor(author: string): Observable<Poem[]> {
    const url = `${this.baseUrl}/author/${encodeURIComponent(author)}`;
    return this.makeRequest(url);
  }

  searchByTitle(title: string): Observable<Poem[]> {
    const url = `${this.baseUrl}/title/${encodeURIComponent(title)}`;
    return this.makeRequest(url);
  }

  searchByAuthorAndTitle(author: string, title: string): Observable<Poem[]> {
    const url = `${this.baseUrl}/author,title/${encodeURIComponent(author)};${encodeURIComponent(title)}`;
    return this.makeRequest(url);
  }

  getRandomPoems(count: number = 10): Observable<Poem[]> {
    const url = `${this.baseUrl}/random/${count}`;
    return this.makeRequest(url);
  }

  private makeRequest(url: string): Observable<Poem[]> {
    return this.http.get<Poem[]>(url).pipe(
      map(response => {
        // Check if response indicates "Not found"
        if (Array.isArray(response) && response.length === 1 &&
            (response[0] as any).status === 404) {
          throw new Error('No poems found matching your search criteria');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        // Only allow 200 responses, throw error for any other status
        if (error.status !== 200) {
          const errorMessage = error.status === 404
            ? 'No poems found matching your search criteria'
            : `Request failed with status ${error.status}: ${error.message}`;
          return throwError(() => new Error(errorMessage));
        }
        return throwError(() => error);
      })
    );
  }
}
