import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { GeminiService } from 'src/app/services/gemini.service';
import { LucideAngularModule } from 'lucide-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
interface Greeting {
  id: number;
  text: string;
}

@Component({
  selector: 'app-greetings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule, LucideAngularModule, MatTooltipModule],
  templateUrl: './greetings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GreetingsComponent implements OnInit {
  greetings: Greeting[] = [];
  newGreeting: string = '';
  editingIndex: number = -1;
  editingText: string = '';
  isLoading: boolean = false;
  selectedGreetingId: number | null = null;

  constructor(private geminiService: GeminiService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    // Load greetings
    this.loadGreetings();
  }
  /**
   * Load greetings from service
   */
  async loadGreetings(): Promise<void> {
    this.isLoading = true;
    try {
      this.greetings = await this.geminiService.getGreetingObjects();

      if (this.selectedGreetingId  !== null) {
        this.greetings.sort((a, b) => {
          return a.id === this.selectedGreetingId ? -1 : 1;  
        });
      }
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu lời chào:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Add a new greeting
   */
  async addGreeting(): Promise<void> {
    if (this.newGreeting && this.newGreeting.trim() !== '') {
      this.isLoading = true;
      try {
        const success = await this.geminiService.addGreeting(this.newGreeting);
        if (success) {
          this.newGreeting = '';
          await this.loadGreetings();
        }
      } catch (error) {
        console.error('Lỗi khi thêm lời chào:', error);
      } finally {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }
  }

  /**
   * Start editing a greeting
   */
  startEditing(index: number): void {
    const greeting = this.greetings[index];
    if (greeting) {
      this.editingIndex = index;
      this.editingText = greeting.text;
      this.cdr.markForCheck();
    }
  }

  /**
   * Save edited greeting
   */
  async saveEditing(): Promise<void> {
    if (this.editingIndex >= 0 && this.editingText && this.editingText.trim() !== '') {
      const greeting = this.greetings[this.editingIndex];
      if (greeting) {
        this.isLoading = true;
        try {
          const success = await this.geminiService.updateGreeting(greeting.id, this.editingText);
          if (success) {
            this.cancelEditing();
            await this.loadGreetings();
          }
        } catch (error) {
          console.error('Lỗi khi cập nhật lời chào:', error);
        } finally {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      }
    }
  }

  /**
   * Cancel editing
   */
  cancelEditing(): void {
    this.editingIndex = -1;
    this.editingText = '';
  }

  /**
   * Delete a greeting
   */
  async deleteGreeting(id: number): Promise<void> {
    this.isLoading = true;
    try {
      const success = await this.geminiService.deleteGreeting(id);
      if (success) {
        await this.loadGreetings();
      }
    } catch (error) {
      console.error('Lỗi khi xóa lời chào:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Reset to default greetings
   */
  async resetGreetings(): Promise<void> {
    this.isLoading = true;
    try {
      const success = await this.geminiService.resetToDefaultGreetings();
      if (success) {
        localStorage.removeItem('selectedGreetingId');
        await this.loadGreetings();

        const newGreeting = await this.geminiService.getRandomGreeting();
        this.geminiService.updateCurrentGreeting(newGreeting);
      }
    } catch (error) {
      console.error('Lỗi khi đặt lại lời chào mặc định:', error);
    } finally {
      this.isLoading = false;
    }
  }

  selectGreeting(id: number): void {
    this.selectedGreetingId = id;
    localStorage.setItem('selectedGreetingId', id.toString());

    // Cập nhật currentGreeting trong FooterComponent
    const selectedGreeting = this.greetings.find(g => g.id === this.selectedGreetingId);
    if (selectedGreeting) {
      this.geminiService.updateCurrentGreeting(selectedGreeting.text); // Cập nhật greeting
    }
    this.cdr.markForCheck();
  }

}
