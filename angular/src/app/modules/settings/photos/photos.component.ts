import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, computed, inject } from '@angular/core';
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
  templateUrl: './photos.component.html'
})
export class PhotosComponent implements OnInit {
  @ViewChildren('imageRef') imageElements!: QueryList<ElementRef>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  tabs = ['HISTORY', 'MY PHOTOS', 'UNSPLASH'];
  activeTab = 'HISTORY';
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
    return this.activeTab === 'MY PHOTOS' ? this.myPhotos : this.photos;
  }

  onImageLoad(event: Event, index: number) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0', 'blur-md');
    this.loadedImages[index] = true;

  }

  toggleSelection(photo) {
    this.backgroundService.toggleSelection(photo);
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
      this.changeDetectorRef.detectChanges();

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
      this.savedImages = await this.indexedDBService.getImages();
      this.myPhotos = [...this.savedImages];
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
}