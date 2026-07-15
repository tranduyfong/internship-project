import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8000/api';

    getRevenueReport(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/revenue?startDate=${startDate}&endDate=${endDate}`);
    }

    getProductReport(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/products?startDate=${startDate}&endDate=${endDate}`);
    }

    getVipCustomers(startDate: string, endDate: string, limit: number = 5): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/customers?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
    }

    getOrderStatusStats(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/order-status?startDate=${startDate}&endDate=${endDate}`);
    }

    getReceiptsByStatus(status: string, startDate: string, endDate: string, page: number = 1, limit: number = 5): Observable<any> {
        return this.http.get(`${this.baseUrl}/receipts/admin?status=${status}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`);
    }

    getOverviewStats(): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/overview-stats`);
    }

    getProfitReport(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/profit?startDate=${startDate}&endDate=${endDate}`);
    }

    compareBrands(month1: string, month2: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/analytics/compare-brands?month1=${month1}&month2=${month2}`);
    }
}