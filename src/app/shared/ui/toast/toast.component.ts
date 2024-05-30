import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { interval, Subject, take, takeUntil } from 'rxjs';
import { ToastConfig } from '../../models/toast.models';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {
  public toastConfig: ToastConfig = ToastConfig.createNewObject();
  public progressionPerc: number = 100;
  public stopProgressBar = new Subject<void>();

  constructor(
    public toastService: ToastService,
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toastService.toastConfig$.subscribe((toastConfig) => {
      this.toastConfig = toastConfig;
      this.cd.detectChanges();
      this.handleAnimation();
    });
  }

  public handleAnimation() {
    if (this.toastConfig.isOpened) {
      this.progressionPerc =
        this.progressionPerc === 0 ? 100 : this.progressionPerc;
      this.cd.detectChanges();
      let progression =
        (this.progressionPerc * this.toastConfig.duration!) / 100;
      const animIncr = () => {
        interval(50)
          .pipe(take(progression / 50), takeUntil(this.stopProgressBar))
          .subscribe({
            next: () => {
              progression -= 50;
              this.progressionPerc =
                (progression / this.toastConfig!.duration!) * 100;
              this.cd.detectChanges();
            },
            error: () => {},
            complete: () => {
              if (progression === 0) {
                this.toastService.toastConfig.next({
                  ...this.toastConfig,
                  isOpened: false,
                });
              }
            },
          });
      };

      this.progressionPerc === 100
        ? setTimeout(() => {
            animIncr();
          }, 800)
        : animIncr();
    }
  }
}
