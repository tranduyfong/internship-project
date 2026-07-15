import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { WarehouseComponent } from './features/warehouse/warehouse.component';
import { AccountsComponent } from './features/accounts/accounts.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    // Bọc toàn bộ các tab quản trị dưới AdminLayout tổng quan
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'warehouse', component: WarehouseComponent },
            { path: 'accounts', component: AccountsComponent }
        ]
    },

    { path: '**', redirectTo: '/login' }
];