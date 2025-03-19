'use client'; // Enable client-side rendering
import userIcon from '@/assets/user.png'; // User icon
import { Users, ArrowLeft } from 'lucide-react';
import '@/css/Usergroups.css'; // Import the CSS file
import Image from 'next/image';
import { useState } from "react";
import styles from "../../css/Subscription.module.css"
import Link from 'next/link';

export default function Subscription() {
    const [isMonthly, setIsMonthly] = useState(true);

    return (
        <div className="usergroups-container">
            {/* Sidebar */}
            <aside className="userGroupsSidebar">
                <ul className="menu">
                    <li className="menu-item">
                        <Image src={userIcon} width={30} height={30} alt="User" priority />
                    </li>
                    <Link href="/subscription" style={{ marginTop: 20 }} className="menu-item active">
                        <Users className="icon" size={20} />
                        <span>Subscription</span>
                    </Link>
                    <Link href="/usergroups" className="menu-item">
                        <Users className="icon" size={20} />
                        <span>User groups</span>
                    </Link>
                </ul>
                {/* Go Back Button at the Bottom */}
                <button className="go-back" onClick={() => window.history.back()}>
                    <ArrowLeft className="go-back-icon" /> Go back
                </button>
            </aside>

            {/* Main Content */}
            <main className="content" style={{ overflowY: "scroll" }}>
                <div className={styles.container}>
                    {/* Toggle Button for Monthly / Annually */}
                    <div className={styles.toggle}>
                        <button
                            className={isMonthly ? styles.active : ""}
                            onClick={() => setIsMonthly(true)}
                        >
                            Monthly
                        </button>
                        <button
                            className={!isMonthly ? styles.active : ""}
                            onClick={() => setIsMonthly(false)}
                        >
                            Annually
                        </button>
                    </div>

                    {/* Pricing Cards */}
                    <div className={styles.pricingCards}>
                        <div className={`${styles.card} ${styles.free} ${styles.selected}`}>
                            <h3>Free</h3>
                            <h2>$0</h2>
                            <p style={{ marginBottom: 22 }}>/month</p>
                            <button className={styles.selected}>Your Plan</button>
                        </div>

                        <div className={styles.card}>
                            <h3>Premium</h3>
                            <h2>{isMonthly ? "$9.99" : "$99.00"}</h2>
                            <p>{isMonthly ? "/month" : "/year"}</p>
                            <small>{isMonthly ? "$8.25 per month if paid annually" : "Save 17%"}</small>
                            <button>Select Plan</button>
                        </div>
                    </div>

                    {/* Feature Comparison Table */}
                    <div className={styles.features}>
                        <h2 className={styles.featurestext}>Features</h2>
                        <table className={styles.featureTable}>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Free</th>
                                    <th>Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AI Chat Messages</td>
                                    <td>Unlimited</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>AI Chat with personal content</td>
                                    <td>3 / day</td>
                                    <td>10 / day</td>
                                </tr>
                                <tr>
                                    <td>AI File Upload</td>
                                    <td>3 / month</td>
                                    <td>20 / month</td>
                                </tr>
                                <tr>
                                    <td>AI Quiz</td>
                                    <td>3 / day</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>AI Lesson Plan</td>
                                    <td>1 / month</td>
                                    <td>Unlimited</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
