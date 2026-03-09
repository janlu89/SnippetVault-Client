import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetDetail } from './snippet-detail';

describe('SnippetDetail', () => {
  let component: SnippetDetail;
  let fixture: ComponentFixture<SnippetDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
