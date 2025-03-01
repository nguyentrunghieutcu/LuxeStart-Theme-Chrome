import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, computed, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Subject, debounceTime, switchMap } from 'rxjs';

import { Backgrounds } from '../../home/tab.model';
import { IndexedDBService } from 'src/app/services/indexed-db.service';
import { BackgroundSelectionService } from 'src/app/services/background-selection.service';
import { UnsplashService } from 'src/app/services/unsplash.service';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photos.component.html'
})
export class PhotosComponent implements OnInit {
  @ViewChildren('imageRef') imageElements!: QueryList<ElementRef>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  tabs = [{ id: 'FAVORITES', name: 'Yêu thích' }, { id: 'my_photos', name: 'Ảnh của tôi' }, { id: 'UNSPLASH', name: 'Unsplash' }];
  activeTab = 'FAVORITES';
  photos = Backgrounds;
  myPhotos: any[] = [];
  imagesUnsplash: string[] = [];
  searchSubject = new Subject<string>();
  savedImages: { id: string; url: string; location: string; photographer: string }[] = [];
  loadedImages: boolean[] = [];

  private backgroundService = inject(BackgroundSelectionService);
  private unsplashService = inject(UnsplashService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private indexedDBService = inject(IndexedDBService);

  selectedBackground = computed(() => {
    const selected = this.backgroundService.selectedBackground();
    return selected ? Backgrounds.find(bg => bg.url === selected.url) || null : null;
  });

  constructor() {
    this.listenForSearch();
  }

  async ngOnInit() {
    await this.loadSavedImages();
    setTimeout(() => this.lazyLoadImages(), 50);
  }

  // ----------------------
  // 🟢 PUBLIC METHODS 
  // ----------------------

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  getFilteredPhotos() {
    return this.activeTab === 'my_photos' ? this.myPhotos : this.photos;
  }

  onImageLoad(event: Event, index: number) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0', 'blur-md');
    this.loadedImages[index] = true;
    this.changeDetectorRef.markForCheck();
  }

  toggleSelection(photo, type: string = 'library') {
    this.backgroundService.toggleSelection(photo, type);
  }

  async onUploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const newImage = {
        id: uuidv4(),
        url: reader.result as string,
        location: 'User Upload',
        photographer: 'You',
      };

      this.myPhotos.push(newImage);
      this.changeDetectorRef.markForCheck();

      try {
        await this.indexedDBService.addImage(newImage);
      } catch (error) {
        console.error('Lỗi khi lưu ảnh vào IndexedDB:', error);
      }
    };

    reader.readAsDataURL(file);
  }

  async onDeleteImage(id: string) {
    this.myPhotos = this.myPhotos.filter(img => img.id !== id);

    try {
      await this.indexedDBService.deleteImage(id);
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
    }
  }

  // ----------------------
  // 🔵 PRIVATE METHODS 
  // ----------------------

  private listenForSearch() {
    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(query => this.unsplashService.getImages(query, 10))
    ).subscribe({
      next: async (urls: string[]) => {
        this.imagesUnsplash = urls;
        await this.saveImagesToDB(urls);
    this.changeDetectorRef.markForCheck();

      },
      error: err => console.error('Lỗi khi lấy ảnh Unsplash:', err)
    });
  }

  private async saveImagesToDB(urls: string[]) {
    const imagesToSave = urls.map(url => ({
      id: this.generateId(url),
      url,
      location: 'Unknown Location',
      photographer: 'Unknown Photographer',
    }));

    try {
      await this.indexedDBService.saveUnsplashImages(imagesToSave);
    } catch (error) {
      console.error('Lỗi khi lưu ảnh từ Unsplash vào IndexedDB:', error);
    }
  }

  private async loadSavedImages() {
    try {
      this.savedImages = await this.indexedDBService.getUnsplashImages();
    } catch (error) {
      console.error('Lỗi khi tải ảnh từ IndexedDB:', error);
    }
  }

  private generateId(url: string): string {
    return url.split('/').pop() || uuidv4();
  }

  private lazyLoadImages() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.getAttribute('src')!;
          img.classList.remove('opacity-0');
          observer.unobserve(img);
        }
      });
    });

    this.imageElements.forEach(img => observer.observe(img.nativeElement));
  }

  suggestions = ['rain in leaf', 'mountain afternoon','forest in the morning', 'snowy mountain peak', 'river in the forest', 'night sky with stars', 'desert landscape', 'waterfall in the mountains', 'sunset over the sea'];
  selectedItem: string | null = null; 

  toggleSelectionSuggestion(item: string) {
    this.selectedItem = this.selectedItem === item ? null : item;

    this.onSuggestionClick(item);
  }

  onSuggestionClick(item: string) {
    this.searchSubject.next(item);
  }
}