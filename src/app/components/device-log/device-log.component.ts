import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../services/app.service';
import * as moment from 'moment';
import {ExportService} from '../../services/export.service';

@Component({
  selector: 'app-device-log',
  templateUrl: './device-log.component.html',
  styleUrls: ['./device-log.component.css']
})
export class DeviceLogComponent implements OnInit {
  logs = [];
  logsExport = [];
  filters = {
    imei: null,
    date: {
      from: null,
      to: null
    },
    afterId: null,
    startId: null,
    limit: 50
  };
  inputSelectAll = false;
  loading = true;


  constructor(private appService: AppService,
              private exportService: ExportService) {
  }

  ngOnInit(): void {
    this.getLogs();
  }

  async getLogs(all = false): Promise<void> {
    const fromDateTime = moment(this.filters.date.from, 'YYYY-MM-DDTHH:mm').toDate().getTime();
    const toDateTime = moment(this.filters.date.to, 'YYYY-MM-DDTHH:mm').toDate().getTime();
    if (toDateTime <= fromDateTime) {
      alert('Khoảng thời gian không hợp lệ!');
      return;
    }
    this.loading = true;
    const dataFilter = {
      ...this.filters,
      date: {
        from: moment(this.filters.date.from, 'YYYY-MM-DDTHH:mm').toDate(),
        to: moment(this.filters.date.to, 'YYYY-MM-DDTHH:mm').toDate()
      }
    };
    if (all) {
      dataFilter.afterId = this.filters.startId;
    }
    const value = await this.appService.getLogs(dataFilter, all).catch(err => null);
    if (value && value.success) {
      if (all) {
        this.logsExport = value.data.list;
      } else {
        if (!!this.filters.afterId) {
          this.logs = [...this.logs, ...value.data.list];
          this.filters.afterId = value.data.list.length > 0 ? (this.logs[this.logs.length - 1]._id) : null;
        } else {
          this.logs = value.data.list;
          this.filters.afterId = value.data.list.length > 0 ? (this.logs[this.logs.length - 1]._id) : null;
        }
        this.filters.startId = value.data.startList[0] ? value.data.startList[0]._id : null;
      }
    } else {
      alert('Cannot get data!!');
      this.logs = [];
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

  async export(): Promise<any> {
    if (!this.filters.imei) {
      alert('Cần phải có imei!');
      return;
    }
    const fromDateTime = moment(this.filters.date.from, 'YYYY-MM-DDTHH:mm').toDate().getTime();
    const toDateTime = moment(this.filters.date.to, 'YYYY-MM-DDTHH:mm').toDate().getTime();
    if (toDateTime <= fromDateTime || (toDateTime - fromDateTime) > 172800000) {
      alert('Khoảng thời gian không hợp lệ!');
      return;
    }
    await this.getLogs(true);
    if (!this.logsExport || this.logsExport.length <= 0) {
      alert('Không thể xuất excel, vui lòng thử lại sau!');
      return;
    }
    const headerTable = [
      {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: '',
        16: '',
        17: '',
        18: 'Device status',
        19: '',
        20: '',
        21: '',
        22: '',
        23: '',
        24: '',
        25: '',
        26: '',
        27: '',
        28: '',
        29: '',
        30: '',
        31: '',
        32: '',
        33: '',
        34: '',
        35: '',
        36: '',
        37: '',
        38: '',
        39: '',
        40: '',
        41: '',
        42: '',
        43: ''
      },
      {
        0: 'Mã bản tin',
        1: 'Dòng thiết bị',
        2: 'IMEI',
        3: 'Firmware version',
        4: 'Boot version',
        5: 'Serial sim',
        6: 'Login Reason',
        7: 'TG server nhận gói tin',
        8: 'Loại gói tin',
        9: 'PckNub',
        10: 'UTC',
        11: 'LAT',
        12: 'LONG',
        13: 'Góc chuyển động',
        14: 'Vận tốc (SpdGPS)',
        15: 'Cường độ GSM',
        16: 'Nhiệt độ 1',
        17: 'Nhiệt độ 2',
        18: 'Server (Bit 1)',
        19: 'GPS (Bit 2)',
        20: 'ACC (Bit 3)',
        21: 'Điều hòa (Bit 4)',
        22: 'Cửa (Bit 5)',
        23: 'Fram (Bit 6)',
        24: 'Flash (Bit 7)',
        25: 'RFID (Bit 8)',
        26: 'Digital out 1 (Bit 9)',
        27: 'Digital out 2 (Bit 10)',
        28: 'AD1',
        29: 'AD2',
        30: 'Biển số xe',
        31: 'ID lái xe',
        32: 'Đăng nhập/đăng xuất',
        33: 'Họ tên lái xe',
        34: 'Số GPLX',
        35: 'TG lx trong ngày (phút)',
        36: 'SL vượt tốc độ trong ngày',
        37: 'SL dừng đỗ trong ngày',
        38: 'TG lái xe liên tục',
        39: 'SL quá TG lái xe liên tục',
        40: 'Tốc độ lấy từ xung xe',
        41: 'Điện áp',
        42: 'Cảm biến mở rộng 1',
        43: 'Cảm biến mở rộng 2'
      }
    ];
    const table = [...headerTable];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.logsExport.length; i++) {
      const log = this.logsExport[i];
      const row = {
        0: (log._id),
        1: (log.type),
        2: (log.imei),
        3: (!log.dvi ? null : log.dvi.fwv),
        4: (!log.dvi ? null : log.dvi.btv),
        5: (!log.dvi ? null : log.dvi.sim),
        6: (!log.dvi ? null : log.dvi.lr),
        7: (moment(new Date(log.svt)).format('HH:mm:ss DD/MM/yyyy')),
        8: (log.event),
        9: (!log.loc ? null : log.loc.pkgn),
        10: (!log.loc ? null : moment(new Date(log.loc.utc)).format('HH:mm:ss DD/MM/yyyy')),
        11: (!log.loc ? null : log.loc.lat),
        12: (!log.loc ? null : log.loc.lon),
        13: (!log.loc ? null : log.loc.course),
        14: (!log.loc ? null : log.loc.spd),
        15: (!log.stt ? null : log.stt.gsig),
        16: (!log.stt ? null : log.stt.temp_1),
        17: (!log.stt ? null : log.stt.temp_2),
        18: (!log.stt ? null : log.stt.gsm),
        19: (!log.stt ? null : log.stt.gps),
        20: (!log.stt ? null : log.stt.acc),
        21: (!log.stt ? null : log.stt.airc),
        22: (!log.stt ? null : log.stt.door),
        23: (!log.stt ? null : log.stt.fram),
        24: (!log.stt ? null : log.stt.flash),
        25: (!log.stt ? null : log.stt.rfid),
        26: (!log.stt ? null : log.stt.do_1),
        27: (!log.stt ? null : log.stt.do_2),
        28: (!log.stt ? null : log.stt.os_1),
        29: (!log.stt ? null : log.stt.os_2),
        30: (!log.vhi ? null : log.vhi.lp),
        31: (!log.stt ? null : log.stt.drid),
        32: (!log.stt ? null : log.stt.drst),
        33: (!log.dvi ? null : log.dvi.drn),
        34: (!log.dvi ? null : log.dvi.drl),
        35: (!log.drs ? null : log.drs.drvt),
        36: (!log.drs ? null : log.drs.osn),
        37: (!log.drs ? null : log.drs.stpn),
        38: (!log.drs ? null : log.drs.drvc),
        39: (!log.drs ? null : log.drs.dotn),
        40: (!log.drf ? null : log.drf.sfp),
        41: (!log.drs ? null : log.drs.exts_1),
        42: (!log.drs ? null : log.drs.exts_2),
        43: (!log.drs ? null : log.drs.exts_3)
      };
      table.push(row);
    }
    this.exportService.exportExcelJson(table, 'table_bigtest', []);
  }
}
