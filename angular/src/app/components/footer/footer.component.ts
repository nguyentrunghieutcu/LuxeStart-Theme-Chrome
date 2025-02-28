import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { fuseAnimations } from 'src/@luxstart/animations';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-footer',
  animations:[fuseAnimations],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  currentGreeting: string = 'Loading...';
  text: string = 'Tạo 1 quote ngắn chủ đề cuộc sống tích cực dài 50 ký tự ';

  constructor(private geminiService: GeminiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.geminiService.getGreeting(this.text).subscribe({
      next: (greeting) => {
        this.currentGreeting = greeting;
        this.cdr.markForCheck()
      },
      error: (err) => this.currentGreeting = 'Error loading greeting'
    });
  }

}
