import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { interval, take } from 'rxjs';
import { ToastConfig } from '../../models/toast.models';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  public toastConfig: ToastConfig = ToastConfig.createNewObject();
  public progressionPerc: number = 0;

  constructor(
    public toastService: ToastService,
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toastService.toastConfig$.subscribe((toastConfig) => {
      this.toastConfig = toastConfig;
      if (toastConfig.isOpened) {
        let progression = 0;
        const repeat = interval(50)
          .pipe(take(this.toastConfig!.duration! / 50))
          .subscribe({
            next: () => {
              progression += 50;
              this.progressionPerc =
                (toastConfig!.duration! / progression) * 100;
              this.cd.detectChanges();
            },
            error: () => {},
            complete: () => {
              console.log('prog', progression);
              if (progression === toastConfig.duration) {
                this.toastService.toastConfig.next({
                  ...toastConfig,
                  isOpened: false,
                });
              }
            },
          });
      }
    });
  }
}
