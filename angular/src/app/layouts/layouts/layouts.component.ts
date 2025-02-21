import { DOCUMENT, NgIf } from '@angular/common';
import {
  Component,
  effect,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subject, combineLatest, takeUntil, map, filter } from 'rxjs';
import { FuseConfig, FuseConfigService } from 'src/@luxstart/config';
import { FuseMediaWatcherService } from 'src/@luxstart/media-watcher/media-watcher.service';

@Component({
  selector: 'layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  config: FuseConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  hasBackground: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private _renderer2: Renderer2,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfigService: FuseConfigService,
  ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // Set the theme and scheme based on the configuration
    combineLatest([
      this._fuseConfigService.config$,
      this._fuseMediaWatcherService.onMediaQueryChange$([
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)',
      ]),
    ])
      .pipe(
        takeUntil(this._unsubscribeAll),
        map(([config, mql]) => {
          const options = {
            scheme: config.scheme,
            theme: config.theme,
          };

          // If the scheme is set to 'auto'...
          if (config.scheme === 'auto') {
            // Decide the scheme using the media query
            options.scheme = mql.breakpoints[
              '(prefers-color-scheme: dark)'
            ]
              ? 'dark'
              : 'light';
          }

          return options;
        })
      )
      .subscribe((options) => {
        // Store the options
        this.scheme = options.scheme;
        this.theme = options.theme;

        // Update the scheme and theme
        this._updateScheme();
        this._updateTheme();
      });

    // Subscribe to config changes
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: FuseConfig) => {
        // Store the config
        this.config = config;

      });

    // Subscribe to NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
      });

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the selected scheme
   *
   * @private
   */
  private _updateScheme(): void {
    // Remove class names for all schemes
    this._document.body.classList.remove('light', 'dark');

    // Add class name for the currently selected scheme
    this._document.body.classList.add(this.scheme);
  }

  /**
   * Update the selected theme
   *
   * @private
   */
  private _updateTheme(): void {
    // Find the class name for the previously selected theme and remove it
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(
          className,
          className.split('-')[1]
        );
      }
    });

    // Add class name for the currently selected theme
    this._document.body.classList.add(this.theme);
  }
}
