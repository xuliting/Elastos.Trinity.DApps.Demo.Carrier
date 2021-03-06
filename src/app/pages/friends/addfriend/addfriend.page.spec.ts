import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddFriendPage } from './addfriend.page';

describe('AddFriendPage', () => {
  let component: AddFriendPage;
  let fixture: ComponentFixture<AddFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFriendPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
