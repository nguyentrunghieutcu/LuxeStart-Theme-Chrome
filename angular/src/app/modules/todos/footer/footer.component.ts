import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Todo, TodosService } from '../todos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private location = inject(Location);
  private todosService = inject(TodosService);

  get todos(): Todo[] {
    return this.todosService.getItems();
  }

  get activeTodos(): Todo[] {
    return this.todosService.getItems();
  }

  get completedTodos(): Todo[] {
    return this.todosService.getItems();
  }

  get filter(): string {
    return this.location.path().split('/')[1] || 'all';
  }

  clearCompleted() {
    this.todosService.clearCompleted();
  }
}