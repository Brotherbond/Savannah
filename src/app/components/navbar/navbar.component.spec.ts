import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideToastr(),
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of({}),
          snapshot: {
            paramMap: {
              get: () => null,
            },
          },
        },
      },
      ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
