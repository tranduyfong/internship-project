import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        const role = localStorage.getItem('userRole');

        if (role === 'admin') {
            return true;
        }
        router.navigate(['/login']);
        return false;
    }
    return false;
};