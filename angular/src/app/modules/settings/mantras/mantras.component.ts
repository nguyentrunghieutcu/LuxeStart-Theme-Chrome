import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MantraService } from 'src/app/services/mantra.service';
import { LucideAngularModule } from 'lucide-angular';
import { TabComponent } from '../../home/tab.component';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Mantra {
  id: number;
  text: string;
}
@Component({
  selector: 'app-mantras',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MatTooltipModule],
  templateUrl: './mantras.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class MantrasComponent implements OnInit {
  mantras: Mantra[] = [];
  newMantra: string = '';
  editingId: number | null = null;
  editingText: string = '';
  isLoading: boolean = false;
  selectedMantraId: number | null = null;
  tabComponent = inject(TabComponent);

  constructor(private mantraService: MantraService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadMantras();
    this.loadSelectedMantra();
  }

  loadSelectedMantra() {
    const selectedMantra = localStorage.getItem('selectedMantra');
    if (selectedMantra) {
      this.selectedMantraId = JSON.parse(selectedMantra);
    }
  }

  selectMantra(id: number) {
    this.selectedMantraId = id;
    this.tabComponent.mantra = this.displayedMantra;
    localStorage.setItem('selectedMantra', JSON.stringify(id));
    this.cdr.markForCheck();
  }

  toggleAIMode() {
    this.tabComponent.toggleMantraMode();
    this.cdr.markForCheck();
  }

  async loadMantras() {
    this.isLoading = true;
    try {
      this.mantras = await this.mantraService.getMantraObjects();

      // Sắp xếp để đưa mantra đã chọn lên đầu danh sách
      if (this.selectedMantraId !== null) {
        this.mantras.sort((a, b) => {
          return a.id === this.selectedMantraId ? -1 : 1; // Đưa mantra đã chọn lên đầu
        });
      }
    } catch (error) {
      console.error('Error loading mantras:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async addMantra() {
    if (!this.newMantra.trim()) return;

    this.isLoading = true;
    try {
      const success = await this.mantraService.addMantra(this.newMantra);
      if (success) {
        await this.loadMantras();
        this.newMantra = '';
      }
    } catch (error) {
      console.error('Error adding mantra:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  generateMantra() {
    if (!this.newMantra.trim()) return;

    this.isLoading = true;
    this.mantraService.getMantra(this.newMantra).subscribe({
      next: async () => {
        await this.loadMantras();
        this.newMantra = '';
      },
      error: (error) => {
        console.error('Error generating mantra:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
      
    });
  }

  startEditing(mantra: Mantra) {
    this.editingId = mantra.id;
    this.editingText = mantra.text;
  }

  async saveEditing() {
    if (!this.editingId || !this.editingText.trim()) return;

    this.isLoading = true;
    try {
      const success = await this.mantraService.updateMantra(this.editingId, this.editingText);
      if (success) {
        await this.loadMantras();
      }
    } catch (error) {
      console.error('Error updating mantra:', error);
    } finally {
      this.isLoading = false;
      this.cancelEditing();
      this.cdr.markForCheck();
    }
  }

  cancelEditing() {
    this.editingId = null;
    this.editingText = '';
  }

  async deleteMantra(id: number) {
    this.isLoading = true;
    try {
      const success = await this.mantraService.deleteMantra(id);
      if (success) {
        await this.loadMantras();
      }
    } catch (error) {
      console.error('Error deleting mantra:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async resetMantras() {
    this.isLoading = true;
    try {
      const success = await this.mantraService.resetToDefaultMantras();
      localStorage.removeItem('selectedMantra');
      if (success) {
        await this.loadMantras();
      }
    } catch (error) {
      console.error('Error resetting mantras:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  get displayedMantra() {
    if (this.selectedMantraId !== null) {
      const selectedMantra = this.mantras.find(m => m.id === this.selectedMantraId);
      return selectedMantra ? selectedMantra.text : 'No selected mantra';
    } else {
      return this.tabComponent.mantra;
    }
  }
} 