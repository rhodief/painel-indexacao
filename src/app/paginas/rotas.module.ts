import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { InicioComponent } from './components/inicio/inicio.component';
import { PainelComponent } from './components/painel/painel.component';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from "@angular/material/core";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Rotas } from './rotas';
import { PdfViewerModule } from "ng2-pdf-viewer";
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
    declarations: [
        InicioComponent,
        PainelComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        PdfViewerModule,
        // ### ANGULAR MATERIAL
        MatListModule,
        MatRippleModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatTabsModule,
        MatExpansionModule,
        MatToolbarModule,
        MatMenuModule,
        // ### END ANGULAR MATERIAL
        RouterModule.forRoot(Rotas)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class RotasModule { }