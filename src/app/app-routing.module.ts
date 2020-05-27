import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { AddRoutingModule } from './add/add-routing.module';
import { LearnRoutingModule } from './learn/learn-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AddRoutingModule,
    LearnRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
