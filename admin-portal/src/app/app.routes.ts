import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/admin/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./users/user-edit.component').then(m => m.UserEditComponent)
      },
      {
        path: 'technologies',
        loadComponent: () => import('./technologies/technologies.component').then(m => m.TechnologiesComponent)
      },
      {
        path: 'technologies/add',
        loadComponent: () => import('./technologies/technology-add.component').then(m => m.TechnologyAddComponent)
      },
      {
        path: 'technologies/edit/:id',
        loadComponent: () => import('./technologies/technology-edit.component').then(m => m.TechnologyEditComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./questions/questions.component').then(m => m.QuestionsComponent)
      },
      {
        path: 'questions/edit/:id',
        loadComponent: () => import('./questions/question-edit.component').then(m => m.QuestionEditComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  }
];
