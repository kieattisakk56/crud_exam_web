import { Routes } from '@angular/router';
import { Test01Component } from './pages/test01/test01.component';
import { Test02Component } from './pages/test02/test02.component';
import { Test03Component } from './pages/test03/test03.component';
import { Test04Component } from './pages/test04/test04.component';
import { Test05Component } from './pages/test05/test05.component';
import { Test06Component } from './pages/test06/test06.component';
import { Test07Component } from './pages/test07/test07.component';
import { Test08Component } from './pages/test08/test08.component';
import { Test09Component } from './pages/test09/test09.component';
import { Test10Component } from './pages/test10/test10.component';

export const routes: Routes = [
  { path: '', redirectTo: 'test01', pathMatch: 'full' },

  { path: 'test01', component: Test01Component },
  { path: 'test02', component: Test02Component },
  { path: 'test03', component: Test03Component },
  { path: 'test04', component: Test04Component },
  { path: 'test05', component: Test05Component },
  { path: 'test06', component: Test06Component },
  { path: 'test07', component: Test07Component },
  { path: 'test08', component: Test08Component },
  { path: 'test09', component: Test09Component },
  { path: 'test10', component: Test10Component },
];
