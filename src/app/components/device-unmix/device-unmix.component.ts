import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {AppService} from '../../services/app.service';
import {ExportService} from '../../services/export.service';

@Component({
  selector: 'app-device-unmix',
  templateUrl: './device-unmix.component.html',
  styleUrls: ['./device-unmix.component.css']
})
export class DeviceUnmixComponent implements OnInit {
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
    const value = await this.appService.getUnmix(dataFilter, all);
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
        1: 'Quản lý',
        2: '',
        3: '',
        4: '',
        5: '',
        6: 'Login',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: 'REALTIME / ALARM / RESEND../',
        15: '',
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
        40: ''
      },
      {
        0: 'Mã bản tin',
        1: 'Thời gian sever nhận gói tin',
        2: 'Loại gói tin MIX',
        3: 'Dòng thiết bị',
        4: 'Imei thiết bị',
        5: 'ID thiết bị',
        6: 'Imei thiết bị',
        7: 'UTC+7 login',
        8: 'Tọa độ Lat/Long',
        9: 'Firmware Version',
        10: 'Boot version',
        11: 'Hardware Version',
        12: 'Sim Serial',
        13: 'Login reason',
        14: 'UTC+7 realtime 10S',
        15: 'Vị trí LATLONG Realtime 10S',
        16: 'Góc chuyển động 10s',
        17: 'Vận tốc GPS 10S',
        18: 'Cường độ GSM 10S',
        19: 'Thông tin GSM 10S',
        20: 'Trạng thái GPS 10S',
        21: 'Trạng thái Fram 10S',
        22: 'Trạng thái Flash 10S',
        23: 'Trạng thái kết nối RFID 10S',
        24: 'Điện áp cấp thiết bị 10S',
        25: 'inAnalog3V.1',
        26: 'inAnalog3V.2',
        27: 'inAnalog5V.1',
        28: 'inAnalog5V.2',
        29: 'inVolLevel.1',
        30: 'inVolLevel.2',
        31: 'inVolLevel.3',
        32: 'Trạng thái quẹt thẻ lái xe',
        33: 'Cảm biến ID THẺ RFID',
        34: 'Lượng thời gian lái xe liên tục của tài xế',
        35: 'Cảnh báo quá TGLXLT4H',
        36: 'Cảnh báo quá TGLXTN10H',
        37: 'Cảnh báo quá vận tốc tối đa',
        38: 'Trạng thái Pin-KHCGT06',
        39: 'Trạng thái cường độ GSM',
        40: 'ID lái xe-IST2'
      }
    ];
    const table = [...headerTable];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.logsExport.length; i++) {
      const log = this.logsExport[i];
      const row = {
        0: (log._id),
        1: (moment(new Date(log.svt)).format('HH:mm:ss DD/MM/yyyy')),
        2: (log.event),
        3: (log.type),
        4: (log.imei),
        5: (log.device ? log.device.DeviceId : null),
        6: (log.type !== 'login') ? null : (log.imei),
        7: (log.type !== 'login') ? null : (moment(new Date(log.loc.utc)).format('HH:mm:ss DD/MM/yyyy')),
        8: (log.type !== 'login') ? null : (!log.loc ? null : log.loc.lat) + (!log.loc ? null : log.loc.lon),
        9: (log.type !== 'login') ? null : (!log.dvi ? null : log.dvi.fwv),
        10: (log.type !== 'login') ? null : (!log.dvi ? null : log.dvi.btv),
        11: (log.type !== 'login') ? null : (!log.dvi ? null : log.dvi.hwv),
        12: (log.type !== 'login') ? null : (!log.dvi ? null : log.dvi.sim),
        13: (log.type !== 'login') ? null : (!log.dvi ? null : log.dvi.lr),
        14: (log.type === 'login') ? null : (!log.loc ? null : moment(new Date(log.loc.utc)).format('HH:mm:ss DD/MM/yyyy')),
        15: (log.type === 'login') ? null : ((!log.loc ? null : log.loc.lat) + (!log.loc ? null : log.loc.lon)),
        16: (log.type === 'login') ? null : (!log.loc ? null : log.loc.course),
        17: (log.type === 'login') ? null : (!log.loc ? null : log.loc.spd),
        18: (log.type === 'login') ? null : (!log.stt ? null : log.stt.gsig),
        19: (log.type === 'login') ? null : (!log.stt ? null : log.stt.gsm),
        20: (log.type === 'login') ? null : (!log.stt ? null : log.stt.gps),
        21: (log.type === 'login') ? null : (!log.stt ? null : log.stt.fram),
        22: (log.type === 'login') ? null : (!log.stt ? null : log.stt.flash),
        23: (log.type === 'login') ? null : (!log.stt ? null : log.stt.rfid),
        24: (log.type === 'login') ? null : (!log.drs ? null : log.drs.exts_1),
        25: (log.type === 'login') ? null : (!log.stt ? null : log.stt.temp_1),
        26: (log.type === 'login') ? null : (!log.stt ? null : log.stt.temp_2),
        27: (log.type === 'login') ? null : (!log.stt ? null : log.stt.os_1),
        28: (log.type === 'login') ? null : (!log.stt ? null : log.stt.os_2),
        29: (log.type === 'login') ? null : (!log.stt ? null : log.stt.os_2),
        30: (log.type === 'login') ? null : (!log.stt ? null : log.stt.airc),
        31: (log.type === 'login') ? null : (!log.stt ? null : log.stt.door),
        32: (log.type === 'login') ? null : (!log.stt ? null : log.stt.drst),
        33: (log.type === 'login') ? null : (!log.stt ? null : log.stt.rfid),
        34: (log.type === 'login') ? null : (!log.drs ? null : log.drs.drvt),
        35: (log.type === 'login') ? null : (!log.stt ? null : log.stt.dc),
        36: (log.type === 'login') ? null : (!log.stt ? null : log.stt.dot),
        37: (log.type === 'login') ? null : (!log.stt ? null : log.stt.ovs),
        38: (log.type === 'login') ? null : (!log.stt ? null : log.stt.bstt),
        39: (log.type === 'login') ? null : (!log.stt ? null : log.stt.gsig),
        40: (log.type === 'login') ? null : (!log.dri ? null : log.dri.drid)
      };
      table.push(row);
    }
    this.exportService.exportExcelJson(table, 'table_bigtest', []);
  }
}
