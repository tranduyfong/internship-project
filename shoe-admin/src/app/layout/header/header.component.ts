import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    adminName: string = 'Admin';

    ngOnInit(): void {
        // Có thể lấy tên từ localStorage nếu muốn hiển thị động
        const storedName = localStorage.getItem('adminName');
        if (storedName) this.adminName = storedName;
    }
}