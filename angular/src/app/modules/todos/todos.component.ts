import { Component, Inject, OnInit, Optional, ViewEncapsulation, computed, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TodoListComponent } from './list/list.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { TodosService } from './todos.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [OverlayModule, TodoListComponent, MatTooltipModule, CommonModule, HeaderComponent, FooterComponent, MatDialogModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './todos.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  mobileMenuOpen = false;
  private todosService = inject(TodosService);
  todos = computed(() => this.todosService.getItems());
 
  
  constructor(
    @Optional() public dialogRef: MatDialogRef<TodosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    effect(() => {
    });
   }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  filter(status): void {
    this.todosService.setStatusFilter(status);
    this.mobileMenuOpen = false
  }

  ngOnInit() {
  }

  reset() {
    this.todosService.reset();

  }
}
