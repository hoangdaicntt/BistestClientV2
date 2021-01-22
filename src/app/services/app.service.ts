import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  getLogs(filters: any, all = false): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/log', {filters, all}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getUnmix(filters: any, all = false): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/mix', {filters, remix: false, all}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getMixed(filters: any, all = false): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/mix', {filters, remix: true, all}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getSmooth(filters: any, all = false): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/smooth', {filters, all}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getErrorLog(filters: any, all = false): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/error', {filters, all}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  auth(username: string, password: string): Promise<any> {
    return this.http.post(environment.host + '/auth', {}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }
}
