import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-results-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PanelModule,
    DividerModule,
    InputTextModule,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
})
export class ResultsPageComponent {
  query: string = '';
  showSidebar: boolean = false;
  sidebarContentVisible: boolean = false;

  isSearching: boolean = false;
  router = inject(Router);

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
    });
  }

  toggleSidebar() {
    if (this.showSidebar) {
      // start closing animation
      this.showSidebar = false;
      // hide content after animation duration (e.g., 300ms)
      setTimeout(() => {
        this.sidebarContentVisible = false;
      }, 300);
    } else {
      // prepare content first
      this.sidebarContentVisible = true;
      this.showSidebar = true;
    }
  }

  onSearch() {
    const trimmed = this.query.trim();
    if (!trimmed) return;

    this.router.navigate(['/results'], { queryParams: { query: trimmed } });
  }
}
