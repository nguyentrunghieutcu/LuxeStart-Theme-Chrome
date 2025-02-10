import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodosService } from '../todos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({ required: true }) todo!: Todo;

  @Output() remove = new EventEmitter<Todo>();

  @ViewChild('todoInputRef') inputRef?: ElementRef;
  private todosService = inject(TodosService);

  title = '';

  isEditing = false;

  toggleTodo(todo, e: Event): void {
    e.preventDefault()
    this.todo.status = this.todo.status == 'completed' ? 'active' : 'completed';
    this.todosService.updateStatus(this.todo.id, this.todo.status)
  }

  removeTodo(e: Event): void {
    e.preventDefault()
    this.remove.emit(this.todo);
    this.todosService.removeItem(this.todo.id)

  }

  startEdit() {
    this.isEditing = true;
  }

  handleBlur(e: Event) {
    this.isEditing = false;
  }

  handleFocus(e: Event) {
    this.title = this.todo.title;
  }

  updateTodo(e) {
    this.todo.title = e.target.value;
    this.isEditing = false;
    this.todosService.updateTitle(this.todo.id, this.todo.title)
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }
}