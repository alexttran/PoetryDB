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
  isExpanded: boolean = false;

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  getDisplayedLines(): string[] {
    if (this.isExpanded || this.poem.lines.length <= 10) {
      return this.poem.lines;
    }
    return this.poem.lines.slice(0, 10);
  }

  shouldShowToggle(): boolean {
    return this.poem.lines.length > 10;
  }
}
