export class DateUtils {
    private static toLocalDateString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static getDateRange(type: 'day' | 'week' | 'month' | 'quarter' | 'year'): { startDate: string, endDate: string } {
        const end = new Date();
        const start = new Date();

        switch (type) {
            case 'day':
                break;
            case 'week':
                start.setDate(end.getDate() - 7);
                break;
            case 'month':
                start.setMonth(end.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(end.getMonth() - 3);
                break;
            case 'year':
                start.setFullYear(end.getFullYear() - 1);
                break;
        }

        return {
            startDate: this.toLocalDateString(start),
            endDate: this.toLocalDateString(end)
        };
    }
}