import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoetryService, Poem } from '../../services/poetry.service';
import { PoemCardComponent } from '../poem-card/poem-card.component';

@Component({
  selector: 'app-poetry-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PoemCardComponent],
  templateUrl: './poetry-search.component.html',
  styleUrls: ['./poetry-search.component.css']
})
export class PoetrySearchComponent {
  searchAuthor: string = '';
  searchTitle: string = '';
  poems: Poem[] = [];
  loading: boolean = false;
  error: string = '';
  searchPerformed: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 15;

  constructor(private poetryService: PoetryService) {
    // Load some random poems on initialization
    this.loadRandomPoems();
  }

  loadRandomPoems(): void {
    this.loading = true;
    this.error = '';
    this.searchPerformed = true;
    this.currentPage = 1;

    this.poetryService.getRandomPoems(5).subscribe({
      next: (data) => {
        this.poems = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load poems';
        this.loading = false;
        this.poems = [];
      }
    });
  }

  search(): void {
    if (!this.searchAuthor.trim() && !this.searchTitle.trim()) {
      this.error = 'Please enter an author name, poem title, or both';
      return;
    }

    this.loading = true;
    this.error = '';
    this.searchPerformed = true;
    this.poems = [];
    this.currentPage = 1;

    let searchObservable;

    if (this.searchAuthor.trim() && this.searchTitle.trim()) {
      // Search by both author and title
      searchObservable = this.poetryService.searchByAuthorAndTitle(
        this.searchAuthor.trim(),
        this.searchTitle.trim()
      );
    } else if (this.searchAuthor.trim()) {
      // Search by author only
      searchObservable = this.poetryService.searchByAuthor(this.searchAuthor.trim());
    } else {
      // Search by title only
      searchObservable = this.poetryService.searchByTitle(this.searchTitle.trim());
    }

    searchObservable.subscribe({
      next: (data) => {
        this.poems = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while searching for poems';
        this.loading = false;
        this.poems = [];
      }
    });
  }

  clearSearch(): void {
    this.searchAuthor = '';
    this.searchTitle = '';
    this.poems = [];
    this.error = '';
    this.searchPerformed = false;
    this.currentPage = 1;
  }

  // Pagination methods
  get paginatedPoems(): Poem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.poems.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.poems.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    // Show max 5 page numbers at a time
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust if we're near the beginning or end
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage > totalPages - 3) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
