import { Component, OnInit, ViewEncapsulation } from '@angular/core';

export interface Holiday {
  id: number;
  name: string;
  date: string;
  isFixed: boolean;
  checked?: boolean;
}

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HolidaysComponent implements OnInit {

  fixedHolidays: Holiday[] = [
    { id: 1, name: 'Tết Dương lịch', date: '2024-01-01', isFixed: true, checked: true },
    { id: 2, name: 'Tết Nguyên Đán', date: '2024-02-10', isFixed: true, checked: true },
    { id: 3, name: 'Giỗ tổ Hùng Vương', date: '2024-04-18', isFixed: true, checked: true },
    { id: 4, name: 'Ngày Giải phóng', date: '2024-04-30', isFixed: true, checked: true },
    { id: 5, name: 'Quốc tế Lao động', date: '2024-05-01', isFixed: true, checked: true },
    { id: 6, name: 'Quốc khánh', date: '2024-09-02', isFixed: true, checked: true }
  ];

  // Danh sách ngày lễ người dùng thêm
  addedHolidays: Holiday[] = [];

  showHolidays: boolean = false;

  newHolidayName: string = '';
  newHolidayDate: Date | null = null;

  ngOnInit() { }

  addHoliday() {
    if (this.newHolidayName && this.newHolidayDate) {
      const newHoliday: Holiday = {
        id: this.addedHolidays.length + 1,
        name: this.newHolidayName,
        date: this.newHolidayDate.toISOString().split('T')[0],
        isFixed: false,
        checked: true
      };
      this.addedHolidays.push(newHoliday);
      this.newHolidayName = '';
      this.newHolidayDate = null;
    }
  }

  deleteHoliday(id: number, isFixed: boolean) {
    if (isFixed) {
      this.fixedHolidays = this.fixedHolidays.filter(holiday => holiday.id !== id);
    } else {
      this.addedHolidays = this.addedHolidays.filter(holiday => holiday.id !== id);
    }
  }

  toggleShowHolidays(event: any) {
    this.showHolidays = event.checked;
  }

  getAllHolidays(): Holiday[] {
    return [...this.fixedHolidays, ...this.addedHolidays];
  }

  onHolidayChecked(holiday: Holiday, event: any) {
    console.log(`${holiday.name} is checked: `, event.checked);
  }

  getFilteredHolidays() {
    return this.showHolidays
      ? this.getAllHolidays()
      : this.addedHolidays
  }
}
