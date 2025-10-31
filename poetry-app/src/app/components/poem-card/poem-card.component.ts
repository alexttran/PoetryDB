import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Poem } from '../../services/poetry.service';

@Component({
  selector: 'app-poem-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poem-card.component.html',
  styleUrls: ['./poem-card.component.css']
})
export class PoemCardComponent {
  @Input() poem!: Poem;
  displayedLineCount: number = 10;

  readMore(): void {
    if (this.displayedLineCount === 10) {
      // First click: jump to 50 lines
      this.displayedLineCount = Math.min(50, this.poem.lines.length);
    } else {
      // Subsequent clicks: increment by 25
      this.displayedLineCount = Math.min(
        this.displayedLineCount + 25,
        this.poem.lines.length
      );
    }
  }

  showLess(): void {
    this.displayedLineCount = 10;
  }

  getDisplayedLines(): string[] {
    if (this.poem.lines.length <= 10) {
      return this.poem.lines;
    }
    return this.poem.lines.slice(0, this.displayedLineCount);
  }

  shouldShowReadMore(): boolean {
    return this.poem.lines.length > 10 &&
           this.displayedLineCount < this.poem.lines.length;
  }

  shouldShowShowLess(): boolean {
    return this.displayedLineCount > 10;
  }

  get isExpanded(): boolean {
    return this.displayedLineCount > 10;
  }
}
