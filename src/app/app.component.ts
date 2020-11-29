import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {AppService} from './services/app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BistestClientV2';
  authed = environment.user.authed;

  constructor(private appService: AppService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.checkLocalAuth();
    environment.user.authChange.addListener('authChange', () => {
      this.authed = environment.user.authed;
    });
  }

  async checkLocalAuth(): Promise<void> {
    if (localStorage.getItem('auth')) {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const result = await this.appService.auth(auth.username, auth.password);
        if (result && result.success) {
          environment.user.username = auth.username;
          environment.user.password = auth.password;
          environment.user.authed = true;
          this.authed = true;
          this.router.navigate(['/device-log']);
        }
      } catch (e) {

      }
    }
  }

  logout(): void {
    localStorage.removeItem('auth');
    location.reload();
  }

}
