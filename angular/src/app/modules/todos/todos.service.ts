import { Injectable, signal } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  status: 'active' | 'completed' | 'deleted';
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  private readonly STORAGE_KEY = 'todos';
  todos = signal<Todo[]>([]);
  status = signal<'all' | 'active' | 'completed' | 'deleted'>('all'); // Trạng thái filter

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    const todosStr = localStorage.getItem(this.STORAGE_KEY);
    this.todos.set(todosStr ? JSON.parse(todosStr) : []);
  }

  private saveTodos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos()));
  }

  addItem(title: string): void {
    const todo: Todo = {
      id: Date.now(),
      title,
      status: 'active', // Mặc định là active khi thêm mới
      timestamp: Date.now(),
    };
    this.todos.update((todos) => [todo, ...todos]);
    this.saveTodos();
  }

  updateStatus(id: number, status: 'active' | 'completed' | 'deleted'): void {
    this.todos.update((todos) =>
      todos.map((t) => (t.id === id ? { ...t, status } : t))
    );
    this.saveTodos();
  }

  updateTitle(id: number, title: string): void {
    this.todos.update((todos) =>
      todos.map((t) => (t.id === id ? { ...t, title } : t))
    );
    this.saveTodos();
  }

  removeItem(id: number): void {
    this.updateStatus(id, 'deleted'); // Đổi status thành deleted
  }

  clearDeleted(): void {
    this.todos.update((todos) => todos.filter((todo) => todo.status !== 'deleted'));
    this.saveTodos();
  }

  clearCompleted(): void {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.status === 'completed' ? { ...todo, status: 'deleted' } : todo))
    );
    this.saveTodos();
  }

  reset() {
    this.todos.set([])
    this.saveTodos();
  }

  toggleAll(status: 'active' | 'completed'): void {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.status !== 'deleted' ? { ...todo, status } : todo))
    );
    this.saveTodos();
  }

  setStatusFilter(status: 'all' | 'active' | 'completed' | 'deleted') {
    this.status.set(status);
  }

  getItems(): Todo[] {
    return this.todos().filter((todo) => {
      const status = this.status();
      if (status === 'active') return todo.status === 'active';
      if (status === 'completed') return todo.status === 'completed';
      if (status === 'deleted') return todo.status === 'deleted';
      return todo.status !== 'deleted'; // all: chỉ lấy active và completed
    });
  }
}