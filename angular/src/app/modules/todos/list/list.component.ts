import { Component, computed, effect, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Todo, TodosService } from '../todos.service';
import { TodoItemComponent } from '../item/item.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './list.component.html',
})
export class TodoListComponent {
  private todosService = inject(TodosService);

  todos = computed(() => this.todosService.getItems());
  activeTodos = computed(() => this.todosService.getItems());

  constructor() {
    effect(() => {
    });
  }

  removeTodo(todo: Todo): void {
    this.todosService.removeItem(todo.id);
  }
}