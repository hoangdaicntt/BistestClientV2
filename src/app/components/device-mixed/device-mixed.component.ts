import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../services/app.service';
import * as moment from 'moment';
import {ExportService} from '../../services/export.service';

@Component({
  selector: 'app-device-mixed',
  templateUrl: './device-mixed.component.html',
  styleUrls: ['./device-mixed.component.css']
})
export class DeviceMixedComponent implements OnInit {
  @ViewChild('tableElement') tableElement: ElementRef;
  logs = [];
  filters = {
    imei: null,
    date: {
      from: null,
      to: null
    },
    afterId: null
  };
  inputSelectAll = false;
  loading = true;

  constructor(private appService: AppService,
              private exportService: ExportService) {
  }

  ngOnInit(): void {
    this.getLogs();
  }

  async getLogs(): Promise<void> {
    this.loading = true;
    const dataFilter = {
      ...this.filters,
      date: {
        from: moment(this.filters.date.from, 'YYYY-MM-DD').toDate(),
        to: moment(this.filters.date.to, 'YYYY-MM-DD').toDate()
      }
    };
    const value = await this.appService.getUnmix(dataFilter);
    if (value && value.success) {
      if (!!this.filters.afterId) {
        this.logs = [...this.logs, ...value.data];
        this.filters.afterId = value.data.length > 0 ? (this.logs[this.logs.length - 1]._id) : null;
      } else {
        this.logs = value.data;
        this.filters.afterId = value.data.length > 0 ? (this.logs[this.logs.length - 1]._id) : null;
      }
    }
    this.loading = false;
  }

  selectAllRows(): void {
    this.logs.map(value => value.selected = this.inputSelectAll);
  }

  getMoreLogs(): void {
    this.getLogs();
  }

  getFilterLogs(): void {
    this.filters.afterId = null;
    this.getMoreLogs();
  }
  export(): void {
    this.exportService.exportExcel(this.tableElement.nativeElement, 'bislog-export');
  }
}
