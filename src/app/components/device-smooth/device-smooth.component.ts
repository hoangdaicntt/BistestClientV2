import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../services/app.service';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import {ExportService} from '../../services/export.service';

@Component({
  selector: 'app-device-smooth',
  templateUrl: './device-smooth.component.html',
  styleUrls: ['./device-smooth.component.css']
})
export class DeviceSmoothComponent implements OnInit {
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
      alert('Khoảng thời gian tìm kiếm không hợp lệ!');
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
    const value = await this.appService.getSmooth(dataFilter, all);
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
    if (toDateTime <= fromDateTime || (toDateTime - fromDateTime) > 172800000) { // 2 day limit
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
        1: 'Quản lý',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: 'Login',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: 'REALTIME / ALARM / RESEND../',
        16: '',
        17: '',
        18: '',
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
        41: ''
      },
      {
        0: 'Mã bản tin',
        1: 'Thời gian từ gói tin',
        2: 'Thời gian sever nhận gói tin',
        3: 'Loại gói tin MIX',
        4: 'Dòng thiết bị',
        5: 'Imei thiết bị',
        6: 'ID thiết bị',
        7: 'IMEI thiết bị Login',
        8: 'DATE thiết bị Login',
        9: 'Địa chỉ thiết bị Login',
        10: 'Firmware Version',
        11: 'Boot version',
        12: 'Hardware Version',
        13: 'Sim Serial',
        14: 'Login reason',
        15: 'IMEI thiết bị',
        16: 'DATE thiết bị Realtime',
        17: 'Địa chỉ thiết bị Realtime',
        18: 'Góc chuyển động Realtime',
        19: 'Vận tốc GPS Realtime',
        20: 'Trạng thái GSM Realtime',
        21: 'Thông tin GSM Realtime',
        22: 'Trạng thái GPS Realtime',
        23: 'Trạng thái Fram Realtime',
        24: 'Trạng thái Flash Realtime',
        25: 'Trạng thái kết nối RFID Realtime',
        26: 'Điện áp cấp thiết bị Realtime',
        27: 'Cảm biến nhiệt độ 1',
        28: 'Cảm biến nhiệt độ 2',
        29: 'Cảm biến dầu 1',
        30: 'Cảm biến dầu 2',
        31: 'inVolLevel.1 CB ON/OFF',
        32: 'inVolLevel.2 CB ON/OFF',
        33: 'inVolLevel.3 CB ON/OFF',
        34: 'CB xung động cơ Realtime',
        35: 'TTQTLX Realtime',
        36: 'Mã thẻ RFID lái xe',
        37: 'LTGLXLT của TX Realtime',
        38: 'Trạng thái Pin-KHCGT06',
        39: 'Cảnh báo quá TGLXLT4H',
        40: 'Cảnh báo quá TGLXTN10H',
        41: 'Cảnh báo quá vận tốc tối đa'
      }
    ];
    const table = [...headerTable];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.logsExport.length; i++) {
      const log = this.logsExport[i];
      const row: any = {
        0: (log._id),
        1: (log.svd),
        2: (moment(new Date(log.svt)).format('HH:mm:ss DD/MM/yyyy')),
        3: (log.event),
        4: (log.type),
        5: (log.imei),
        6: (log.device ? log.device.DeviceId : null),
        7: (log.type !== 'login') ? null : this.getContent(log.imei),
        8: (log.type !== 'login') ? null : this.getContent(moment(new Date(log.loc.utc)).format('HH:mm:ss DD/MM/yyyy')),
        9: (log.type !== 'login') ? null : this.getContent(log.loc.addr),
        10: (log.type !== 'login') ? null : this.getContent(log.dvi.fwv),
        11: (log.type !== 'login') ? null : this.getContent(log.dvi.btv),
        12: (log.type !== 'login') ? null : this.getContent(log.dvi.hwv),
        13: (log.type !== 'login') ? null : this.getContent(log.dvi.sim),
        14: (log.type !== 'login') ? null : this.getContent(log.dvi.lr),
        15: (log.type === 'login') ? null : this.getContent(log.imei),
        16: (log.type === 'login') ? null : this.getContent(moment(new Date(log.loc.utc)).format('HH:mm:ss DD/MM/yyyy')),
        17: (log.type === 'login') ? null : this.getContent(log.loc.addr),
        18: (log.type === 'login') ? null : this.getContent(log.loc.course),
        19: (log.type === 'login') ? null : this.getContent(log.loc.spd),
        20: (log.type === 'login') ? null : this.getContent(log.stt.gsig),
        21: (log.type === 'login') ? null : this.getContent(log.stt.gsm),
        22: (log.type === 'login') ? null : this.getContent(log.stt.gps),
        23: (log.type === 'login') ? null : this.getContent(log.stt.fram),
        24: (log.type === 'login') ? null : this.getContent(log.stt.flash),
        25: (log.type === 'login') ? null : this.getContent(log.stt.rfid),
        26: (log.type === 'login') ? null : this.getContent(log.drs.exts_1),
        27: (log.type === 'login') ? null : this.getContent(log.stt.temp_1_c),
        28: (log.type === 'login') ? null : this.getContent(log.stt.temp_2_c),
        29: (log.type === 'login') ? null : this.getContent(log.stt.os_1_c),
        30: (log.type === 'login') ? null : this.getContent(log.stt.os_2_c),
        31: (log.type === 'login') ? null : this.getContent(log.stt.acc_c),
        32: (log.type === 'login') ? null : this.getContent(log.stt.airc_c),
        33: (log.type === 'login') ? null : this.getContent(log.stt.door_c),
        34: (log.type === 'login') ? null : this.getContent(null),
        35: (log.type === 'login') ? null : this.getContent(log.drs.drst),
        36: (log.type === 'login') ? null : this.getContent(log.drs.rfid2),
        37: (log.type === 'login') ? null : this.getContent(log.drs.drvt),
        38: (log.type === 'login') ? null : this.getContent(log.drs.bstt),
        39: (log.type === 'login') ? null : this.getContent(log.stt.dc),
        40: (log.type === 'login') ? null : this.getContent(log.stt.dot),
        41: (log.type === 'login') ? null : this.getContent(log.stt.ovs)
      };
      table.push(row);
    }
    this.exportService.exportExcelJson(table, 'table_bigtest', []);
  }

  getContent(value: any): string {
    return (!!value || value === 0) ? value : '--';
  }
}
