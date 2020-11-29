import {Component, OnInit} from '@angular/core';
import {AppService} from '../../services/app.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  username = '';
  password = '';

  constructor(private appService: AppService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    const result = await this.appService.auth(this.username, this.password);
    if (result && result.success) {
      environment.user.username = this.username;
      environment.user.password = this.password;
      environment.user.authed = true;
      environment.user.authChange.emit('authChange', {});
      localStorage.setItem('auth', JSON.stringify(environment.user));
      this.router.navigate(['/device-log']);
    } else {
      alert('Sai lên đang nhập hoặc mật khẩu');
    }
  }

}
