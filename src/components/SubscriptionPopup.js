import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/css/Subscription.module.css"; // Use the same CSS as the subscription page
import { IndianRupee } from "lucide-react";
import Loading from "./Loading";

export default function SubscriptionPopup({ onClose }) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [subscriptions, setSubscriptions] = useState(null);

  // Fetch subscription details from the API
  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await axios.get("/api/subscriptionDetail");
        if (res.data.success) {
          const subData = res.data.subscriptions;

          // Organize the subscription data
          const freePlan = subData.find((sub) => sub.subscriptionTitle === "Free");
          const premiumMonthly = subData.find(
            (sub) => sub.subscriptionTitle === "Premium" && sub.type === "monthly"
          );
          const premiumAnnually = subData.find(
            (sub) => sub.subscriptionTitle === "Premium" && sub.type === "annually"
          );

          setSubscriptions({
            free: freePlan || { price: 0 },
            premiumMonthly: premiumMonthly || { price: 999 },
            premiumAnnually: premiumAnnually || { price: 9999 },
          });
        } else {
          console.error("Failed to fetch subscriptions:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    }
    fetchSubscriptions();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
       {subscriptions ? <div className={styles.container}>
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

          <div className={styles.pricingCards}>
            {/* Free Plan */}
            <div className={`${styles.card} ${styles.free} ${styles.selected}`}>
              <h3>Free</h3>
              <h2>
                <IndianRupee size={30} />
                {subscriptions.free.price}
              </h2>
              <p style={{ marginBottom: 22 }}>/month</p>
              <button className={styles.selected}>Your Plan</button>
            </div>

            {/* Premium Plan (Monthly / Annually) */}
            <div className={styles.card}>
              <h3>Premium</h3>
              <h2>
                <IndianRupee size={30} />
                {isMonthly
                  ? subscriptions.premiumMonthly.price
                  : subscriptions.premiumAnnually.price}
              </h2>
              <p>{isMonthly ? "/month" : "/year"}</p>
              <p>* Excluding GST</p>
              <button>Select Plan</button>
            </div>
          </div>

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
        </div>: <Loading text="Fetching subscription plan"/>}
      </div>
    </div>
  );
}
