import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, computed, inject } from '@angular/core';
import { Backgrounds } from '../../tab/tab.model';
 import { v4 as uuidv4 } from 'uuid';
import { IndexedDBService } from 'src/app/services/indexed-db.service';
import { BackgroundSelectionService } from 'src/app/services/background-selection.service';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  @ViewChildren('imageRef') imageElements!: QueryList<ElementRef>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
 
  tabs = ['MY PHOTOS', 'FAVORITES', 'HISTORY'];
  activeTab = 'HISTORY';
  photos = Backgrounds;
  myPhotos: any[] = [];
  private backgroundService = inject(BackgroundSelectionService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  selectedBackground = computed(() => {
    const selected = this.backgroundService.selectedBackground();
    return selected
      ? Backgrounds.find(bg => bg.url === selected.url) || null
      : null;
  });

  constructor(private indexedDBService: IndexedDBService) {}

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  async ngOnInit() {
    this.myPhotos = await this.indexedDBService.getImages();
    setTimeout(() => this.lazyLoadImages(), 50);
  }
  getFilteredPhotos() {
    return this.activeTab === 'MY PHOTOS' ? this.myPhotos : this.photos;
  }
  
  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('opacity-0', 'blur-md');
  }
 
  toggleSelection(photo) {
    this.backgroundService.toggleSelection(photo);
  }

  lazyLoadImages() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.getAttribute('src')!;
          img.classList.remove('opacity-0'); // Hiện ảnh khi load xong
          observer.unobserve(img);
        }
      });
    });

    this.imageElements.forEach(img => observer.observe(img.nativeElement));
  }

  async onUploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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
        await this.indexedDBService.addImage(newImage);
      };

      reader.readAsDataURL(file);
    }
  }

  async onDeleteImage(id: string) {
    this.myPhotos = this.myPhotos.filter((img) => img.id !== id);
    await this.indexedDBService.deleteImage(id);
  }
}
