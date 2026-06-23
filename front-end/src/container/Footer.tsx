import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-5 pb-4">
            <div className="container">
                <div className="row g-4">
                    {/* Cột 1 */}
                    <div className="col-12 col-md-3">
                        <h5 style={{ color: '#e6a323', fontWeight: 'bold', marginBottom: '1.5rem' }}>BECK</h5>
                        <p className="text-light" style={{ lineHeight: '1.8' }}>
                            Website bán giày thể thao chính hãng
                        </p>
                    </div>

                    {/* Cột 2 */}
                    <div className="col-12 col-md-3">
                        <h5 style={{ color: '#e6a323', fontWeight: 'bold', marginBottom: '1.5rem' }}>Hỗ trợ</h5>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="#" className="text-light text-decoration-none footer-link">Chính sách bảo hành</Link></li>
                            <li><Link to="#" className="text-light text-decoration-none footer-link">Chính sách đổi trả</Link></li>
                            <li><Link to="#" className="text-light text-decoration-none footer-link">Hướng dẫn mua hàng</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="col-12 col-md-3">
                        <h5 style={{ color: '#e6a323', fontWeight: 'bold', marginBottom: '1.5rem' }}>Liên hệ</h5>
                        <ul className="list-unstyled d-flex flex-column gap-2 text-light" style={{ lineHeight: '1.8' }}>
                            <li>Email: support.beck@gmail.com</li>
                            <li>Hotline/Zalo: 0931. 51. 41. 31</li>
                            <li>Địa chỉ: 639 Kim Ngưu, P. Vĩnh Tuy, Q. Hai Bà Trưng, Hà Nội (mặt đường lớn)</li>
                        </ul>
                    </div>

                    {/* Cột 4 */}
                    <div className="col-12 col-md-3">
                        <h5 style={{ color: '#e6a323', fontWeight: 'bold', marginBottom: '1.5rem' }}>Đăng ký nhận tin khuyến mãi</h5>
                        <div className="d-flex flex-column gap-3">
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-light rounded-pill px-4 py-2"
                                placeholder="Nhập email của bạn tại đây"
                                style={{ fontFamily: 'Quicksand' }}
                            />
                            <button className="btn btn-outline-light rounded-pill w-50 py-2" style={{ fontFamily: 'Quicksand' }}>
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;