import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PoetrySearchComponent } from './components/poetry-search/poetry-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PoetrySearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'poetry-app';
}
