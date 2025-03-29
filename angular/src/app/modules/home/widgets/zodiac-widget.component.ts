import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ZodiacSelectorComponent } from '../../settings/zodiac/zodiac-selector.component';
import { ZodiacStorageService } from '../../settings/zodiac/zodiac.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DarkModeService } from '../../../services/darkmode.service';

@Component({
    selector: 'app-zodiac-widget',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, MatDialogModule, ReactiveFormsModule],
    templateUrl: './zodiac-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZodiacWidgetComponent implements OnInit {
    private dialog = inject(MatDialog);
    private zodiacStorage = inject(ZodiacStorageService);
    private darkModeService = inject(DarkModeService);
    private cd = inject(ChangeDetectorRef);
    // Remove cd injection as we'll use signals
    isSquareLayout = true;
    isDarkMode = this.darkModeService.isDarkMode();

    today = new Date();
    hasZodiacInfo = false;
    showSetupForm = false;
    setupForm: FormGroup;

    // Use computed signals from service
    readonly selectedSign = this.zodiacStorage.selectedSign;
    readonly zodiacInfo = this.zodiacStorage.zodiacInfo;

    constructor(private fb: FormBuilder) {
        this.setupForm = this.fb.group({
            name: ['', [Validators.required]],
            birthDate: ['', [Validators.required]]
        });

        // Effect to handle zodiac info changes
        effect(() => {
            const info = this.zodiacInfo();
            if (info) {
                console.log(info)
                this.hasZodiacInfo = true;
                this.cd.markForCheck();
            }
        });
    }
    
    ngOnInit() {
        const savedData = this.zodiacStorage.getZodiacInfo();
        if (savedData && this.zodiacStorage.isDataValid(savedData.timestamp)) {
            this.zodiacStorage.setSelectedSign(savedData.sign);
            this.zodiacStorage.saveZodiacInfo(savedData.sign, savedData.info);
            this.cd.markForCheck();

        }

        // Listen to system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            this.isDarkMode = this.darkModeService.isDarkMode();
        });
    }

    onSubmitSetup() {
        if (this.setupForm.valid) {
            const { name, birthDate } = this.setupForm.value;
            // Calculate zodiac sign based on birth date
            const sign = this.calculateZodiacSign(new Date(birthDate));

            // Save to storage
            // this.zodiacStorage.saveZodiacInfo(name,
            //     birthDate,
            //     sign);
             this.hasZodiacInfo = true;
        }
    }

    private calculateZodiacSign(date: Date): string {
        // Add zodiac calculation logic here
        // Return zodiac sign based on birth date
        return 'aries'; // Placeholder
    }

    toggleLayout() {
        this.isSquareLayout = !this.isSquareLayout;
    }

    openZodiacSelector() {
        const dialogRef = this.dialog.open(ZodiacSelectorComponent, {
            width: '400px',
            panelClass: 'custom-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.zodiacStorage.setSelectedSign(result);
                this.zodiacStorage.fetchZodiacInfo(result)
                this.cd.markForCheck();

            }
        });
    }


    getVietnameseName(sign: string | null): string {
        if (!sign) return '';
        const signMap: Record<string, string> = {
            'aries': 'Bạch Dương',
            'taurus': 'Kim Ngưu',
            'gemini': 'Song Tử',
            'cancer': 'Cự Giải',
            'leo': 'Sư Tử',
            'virgo': 'Xử Nữ',
            'libra': 'Thiên Bình',
            'scorpio': 'Bọ Cạp',
            'sagittarius': 'Nhân Mã',
            'capricorn': 'Ma Kết',
            'aquarius': 'Bảo Bình',
            'pisces': 'Song Ngư'
        };
        return signMap[sign] || sign;
    }
}