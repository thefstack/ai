"use client"

import React from 'react';
import '../../css/PrivacyPolicy.css'; // Import the CSS for styling
import { ArrowLeft } from "lucide-react"; // Import the ArrowLeft icon

const PrivacyPolicy = () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="privacy-policy-container">
           <button className="back-button" onClick={goBack}>
                <ArrowLeft className="back-icon" /> Back
            </button>
            <h2 className="mainheading">Privacy Policy</h2>


            <p>
                Please read and understand the terms before using our services, by visiting the website or availing the related services, the users are bound by and accept the terms of use described herein.           </p>


            <h3 style={{ marginTop: -15 }} className="heading">Introduction:</h3>
            <p>
                Welcome to Ivy Ai Tutor. This privacy policy explains how we collect, use, disclose, and safeguard your personal information when you use our AI services and visit our website. We respect the privacy of each and every person and are committed to protecting the personal information of our users.            </p>

            <p>
                Please also keep in mind that whenever you yourself disclose your personal information online, that information can be collected and accessed by users, you may also receive unsolicited messages from other parties in return. Ultimately, you are solely responsible for maintaining the secrecy of your personal information. Please be careful and responsible whenever you&apos;re online.            </p>
            <p>Person using this website to avail the services, have read, understood, and accepted completely and unconditionally the privacy policy, read together with the Terms of Service.

            </p>
            <h3 className="heading">Acceptance of Terms:</h3>
            <p>
                By using the Website, the User agrees to the terms and conditions provided herein. If the User does not agree to the terms and conditions of this policy, they should immediately cease all usage of this Website.            </p>
            <p>The Terms of Service and Privacy Policy act jointly and severally and mutual acceptance of both is mandatory for usage of the Website.

            </p>
            <h3 className="heading">Information We Collect:</h3>
            <p><strong>Personal information:</strong> When you use our services, you may voluntarily provide information such as name, email address, and other contact details.</p>
            <p><strong>Usage Data:</strong> We may collect information about how you interact with our website and legal AI tools, including IP addresses, browser types, and device identifiers.</p>
            <p><strong>AI Data:</strong> When you use our AI services, we may collect data generated or processed by our AI algorithms, such as text inputs, queries, or other information provided for analysis.</p>
            <p><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie preferences through your browser settings.</p>

            <h3 className="heading">How We Use Collected Information:</h3>
            <p>A.<strong> Provide AI Service:</strong> To provide and improve our AI Service.</p>
            <p>B.<strong> Communication:</strong> To respond to your queries and provide support.</p>
            <p>C.<strong> Analytics:</strong> To analyze usage patterns and enhance our website and AI services.</p>
            <p>D.<strong> Research and Development:</strong> To improve our AI algorithms and develop new features.</p>
            <p>E. <strong>Legal Compliance:</strong> To comply with legal obligations.</p>

            <h3 className="heading">Data Sharing:</h3>
            <p>
                We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul>
                <li><strong>Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our website and providing our AI services.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests.</li>
            </ul>
            <p>In that case, the use has chosen to the third-party website or application such as Google, WhatsApp, Facebook, as a medium of access, certain information may be disclosed to such third-party websites or applications to ensure that the website is fully functional.</p>
            <h3 className="heading">Data Security:</h3>
            <p>
                Query made by you and documents uploaded would be shared with AI engines of third parties for processing and result. No method of transmission over the internet is entirely secure, and we cannot guarantee the absolute security of your data.
            </p>
            <p>This website does not sell or rent the user’s personal information to the third parties.</p>
            <p>Our securities and privacy policies are periodically reviewed and enhanced as necessary and only authorised individuals have access to the information provided by our customers

            </p>
            <h3 className="heading">Log Data:</h3>
            <p>Our servers automatically record information (“Log Data”) created by Your use of Our Website. Log Data may include information such as Your IP address, browser type, operating system, the referring web page, pages visited, location, Your mobile carrier, device and application IDs, search terms, and cookie information. We receive Log Data whenever You interact with Our Website. We use the Log Data to monitor and analyse use of Our Website for technical administration to measure, customize, and improve Our services for the Users.</p>

            <h3 className="heading">Phishing:</h3>
            <p>
                We recommend Users not to disclose any sensitive information on the Website/Application. We shall make Our best endeavours to keep Our Website/Application safe and secure to avoid any phishing scams. We do not and will not, at any time, request Your credit card information, your login password, national identification number or any other personal information except as is required during the registration process, verification process or payment process. You have a responsibility to report any phishing links appearing on the Website/Application by contacting Us.            </p>

            <h3 className="heading">User Rights:</h3>
            <p>
                We value the User&apos;s privacy and will reasonably endeavor to protect all User information. The Website keeps a record of the activities of each User to give the User complete and comprehensive care.
            </p>
            <p>The Users have the right to amend and modify any information provided by them, which the Website/Application maintains.</p>

            <h3 className="heading">Third-Party Sites and Services:</h3>
            <p>
                Ivy Ai Tutor websites, applications, and services may contain links to third-party websites, products, and services. Information collected by third parties, which may include such things as location data or contact details, credentials, is governed by their privacy practices. We encourage you to learn about the privacy practices of those third parties.            </p>

            <h3 className="heading">Changes and Modifications:</h3>
            <p>
                We reserve the right, at any time, to modify, alter, or update the terms and conditions of this Agreement without prior notification to the Users. We will upload the modified Privacy Policy on Our Website/Application as well as notify Users regarding such modification by providing appropriate notice on the Website/Application and/or via email.            </p>
            <p>Modifications shall become effective immediately upon notification. The User&aposs;s continued use of the Website/Application after such amendments are posted constitutes an acknowledgment and acceptance of the Agreement and its modifications.</p>
            <h3 className="heading">Changes to this Privacy Policy:</h3>
            <p>
                We may update Our Privacy Policy from time to time on our website.
            </p>
            <p>
                You are advised to review this Privacy Policy periodically for ay changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            <h3 className="heading">Survival of Policy:</h3>
            <p>In the event of deactivation of use of website by the user, this entire agreement/policy will continue to remain in effect with regard to proprietary information at all time.</p>
            <h3 className="heading">General Terms:</h3>
            <p>
                Other uses and disclosures of information not covered by this Privacy Policy, or by other laws that apply to the Website, will be made only with the User&apos;s written permission. If the User gives permission to use or share their personal information, they may cancel that permission, in writing, at any time. If the User cancels permission, we will no longer use or share the information for the reasons covered in the said written permission. The User understands however, that We cannot reverse any disclosures which have already been made with the User&apos;s permission.
            </p>
            <p>
                Any dispute arising out of the violation or breach of this Privacy Policy shall be subject to arbitration and the laws of State of Maharashtra, India shall apply and the courts in the city of Mumbai, India in particular shall have exclusive jurisdiction over any cases arising from such breach or violations. However, we may change the governing law in the future without prior notification to the Users.
            </p>
            <h3 className="heading">Contact Us:</h3>
            <p>
                The Users can use the “Contact Us” section on the Website or email Us for any help, questions and concerns in the use of or technical problems occurring in the Website.
            </p>
            <p>
                By using our website and AI services, you consent to the practices described in this Privacy Policy.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
