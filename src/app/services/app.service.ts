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

  getLogs(filters: any): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/log', {filters}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getUnmix(filters: any): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/mix', {filters, remix: false}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getMixed(filters: any): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/mix', {filters, remix: true}, {
      headers: {
        Username: username,
        Password: password
      }
    }).toPromise();
  }

  getSmooth(filters: any): Promise<any> {
    const {username, password} = environment.user;
    return this.http.post(environment.host + '/smooth', {filters}, {
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
