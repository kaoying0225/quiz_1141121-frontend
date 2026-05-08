import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { BListComponent } from './@backend/b-list/b-list.component';
import { QuizViewComponent } from './@components/quiz-view/quiz-view.component';
import { QuizFillComponent } from './@frontend/quiz-fill/quiz-fill.component';
import { LoginComponent } from './@user/login/login.component';
import { RegistrationComponent } from './@user/registration/registration.component';
import { FillConfirmComponent } from './@frontend/fill-confirm/fill-confirm.component';
import { PersonalFeedbackComponent } from './@frontend/personal-feedback/personal-feedback.component';
import { QuizResultComponent } from './@components/quiz-result/quiz-result.component';
import { UserResultComponent } from './@components/user-result/user-result.component';
import { ChangePwdComponent } from './@user/change-pwd/change-pwd.component';
import { ChartComponent } from './@components/chart/chart.component';

export const routes: Routes = [
  // 新增這行：當路徑為空（即開啟網站時），自動重導向到 login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'registration', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'change-pwd', component: ChangePwdComponent},
  {path: 'blist', component: BListComponent},
  {path: 'b-view/:id', component: QuizViewComponent},
  {path: 'b-result/:id/:title', component: QuizResultComponent},
  {path: 'b-chart/:id', component: ChartComponent},
  {path: 'user-result/:id/:email', component: UserResultComponent},
  {path: 'list', component: ListComponent},
  {path: 'quiz-fill/:id', component: QuizFillComponent},
  {path: 'fillin-confirm', component: FillConfirmComponent},
  {path: 'personal-feedback/:id', component: PersonalFeedbackComponent},
];
