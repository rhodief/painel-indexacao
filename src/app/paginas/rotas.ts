import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { PainelComponent } from './components/painel/painel.component';

export const Rotas: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
    },
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: 'painel',
        component: PainelComponent
    }
];