export class DateUtils {
    static getDateRange(type: 'day' | 'week' | 'month' | 'quarter' | 'year'): { startDate: string, endDate: string } {
        const end = new Date();
        const start = new Date();

        switch (type) {
            case 'day': start.setDate(end.getDate() - 1); break;
            case 'week': start.setDate(end.getDate() - 7); break;
            case 'month': start.setMonth(end.getMonth() - 1); break;
            case 'quarter': start.setMonth(end.getMonth() - 3); break;
            case 'year': start.setFullYear(end.getFullYear() - 1); break;
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    }
}