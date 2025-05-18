import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  query: string = '';

  isSearching: boolean = false;
  router = inject(Router);

  onSearch() {
    const trimmed = this.query.trim();
    if (!trimmed) return;

    this.router.navigate(['/results'], {
      queryParams: { query: trimmed },
    });
  }
}
