import React from 'react';
import { Link } from 'react-router-dom';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
    return (
        <div className="employee-detail-page">
            {/* Background Image Section */}
            <div className="employee-detail-bg-section">
                <img
                    src="/src/assets/employee-detail-bg.png"
                    alt="Employee Detail Background"
                    className="employee-detail-bg-image"
                />

                {/* Header Content Inside Background */}
                <div className="employee-detail-header-content">
                    {/* Left Side - Employee Information */}
                    <div className="employee-detail-left">
                        {/* Breadcrumb Navigation */}
                        <div className="breadcrumb">
                            <span>Üzvlərimiz</span>
                            <span className="separator">&gt;</span>
                            <span>Raul Mirzəyev</span>
                        </div>

                        {/* Employee Name and Title */}
                        <div className="employee-info">
                            <h1 className="employee-name">Raul Mirzəyev</h1>
                            <div className="employee-title">
                                <div className="title-icon"></div>
                                <p>Ürək-damar cərrahı - Bakı Klinikası</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="contact-info">
                            <div className="contact-item">
                                <img src="/src/assets/phone-icon.png" alt="Phone" className="contact-icon" />
                                <span>+(994) 50 xxx xx xx</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/whatsapp-icon.png" alt="WhatsApp" className="contact-icon" />
                                <span>+(994) 50 xxx xx xx</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/mail-icon.png" alt="Email" className="contact-icon" />
                                <span>example@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/location-icon.png" alt="Location" className="contact-icon" />
                                <span>Bakı, Azərbaycan</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Employee Image */}
                    <div className="employee-detail-right">
                        <img src="/src/assets/employee1.png" alt="Employee" className="employee-detail-image" />
                    </div>
                </div>
            </div>

            {/* New Section: About Employee */}
            <div className="employee-about-section">
                <div className="employee-about-content">
                    <div className="about-title-container">
                        <h2 className="about-title">Mən Kiməm?</h2>
                    </div>
                    <p className="about-paragraph">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                        Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
                        Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,
                        from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                    </p>
                    <p className="about-paragraph">
                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                        Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in
                        their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                    </p>
                </div>

                {/* Right Side - Equipment DNA Image */}
                <div className="equipment-dna-right">
                    <img src="/src/assets/equipment-dna.png" alt="Equipment DNA" className="equipment-dna-image" />
                </div>
            </div>

            {/* New Section: Divided Layout */}
            <div className="employee-divided-section">
                <div className="divided-left">
                    <img src="/src/assets/employee-detail.png" alt="Employee Detail" className="divided-left-image" />
                </div>
                <div className="divided-right">
                    <div className="timeline-section">
                        <div className="timeline-title-container">
                            <h3 className="timeline-title">Tibbə Aparan Yol</h3>
                        </div>
                        <p className="timeline-description">
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                            Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
                            Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,
                            from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                        </p>

                        <div className="timeline-container">
                            <div className="timeline-line"></div>

                            <div className="timeline-item">
                                <div className="timeline-number">01</div>
                                <div className="timeline-dot timeline-dot-1"></div>
                                <div className="timeline-content">
                                    <h4 className="timeline-item-title">University of Medicine in Colifonia</h4>
                                    <p className="timeline-item-date">2010-2016</p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">02</div>
                                <div className="timeline-dot timeline-dot-2"></div>
                                <div className="timeline-content">
                                    <h4 className="timeline-item-title">University of Medicine (Master degree)</h4>
                                    <p className="timeline-item-date">2016-2018</p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">03</div>
                                <div className="timeline-dot timeline-dot-3"></div>
                                <div className="timeline-content">
                                    <h4 className="timeline-item-title">America Government Clinic</h4>
                                    <p className="timeline-item-date">2019-2023</p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">04</div>
                                <div className="timeline-dot timeline-dot-4"></div>
                                <div className="timeline-content">
                                    <h4 className="timeline-item-title">Baku Clinic</h4>
                                    <p className="timeline-item-date">2023-indi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
