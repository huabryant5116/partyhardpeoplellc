Party Hard People LLC — Final Developer-Ready Product Requirements Document
Version 1.0 · October 9, 2026 · Status: Requirements baseline for repository audit and implementation planning
1. Executive summary
Party Hard People LLC needs a mobile-friendly, conversion-focused website for customized children's parties, entertainment, and equipment rentals throughout Los Angeles, Orange County, and San Diego.
The website must help adults plan memorable events without feeling pressured to book. Customers explore options, build a party request, and receive a personalized quote. The owner reviews the request, sends a quote, and confirms the booking after acceptance and successful deposit payment.
The project is already underway in Antigravity IDE with Claude Code. The first technical requirement is to inspect the existing repository, preserve useful work, and plan changes before editing code.
Product goals
1. Generate more qualified quote requests.
2. Convert accepted quotes into confirmed, deposit-paid bookings.
3. Prevent rental inventory from being double-booked.
4. Reduce manual administration through email, SMS, and workflow automation.
5. Give the owner control over website content, services, rentals, and policies.
6. Establish a secure, reliable foundation that can expand without unnecessary recurring costs.
Scope and priorities
Priority	Capability
P0 — Launch essentials	Public website, service/rental pages, party builder, quote form, owner alerts, customer confirmation, mobile responsiveness, SEO foundations
P1 — Booking operations	Owner dashboard, quote management, 7-day expiration, configurable deposit, secure payment processing, inventory reservation
P1 — Operational reliability	Email and SMS notifications, booking reminders, cancellation/refund records, weather rescheduling
P2 — Growth	Full CMS, marketing attribution, review requests, analytics, promotional content
P3 — Expansion	AI planning assistance, customer accounts, advanced CRM integrations, expanded delivery scheduling
Release rule: Do not accept real deposits or represent bookings as confirmed until payment verification, inventory concurrency protection, access controls, and relevant booking policies are implemented and tested.
2. Business overview and target customers
Services and event types
The website must support the following service categories:
- Entertainment: DJ and music entertainment, karaoke, singing and dancing games, party hosts and MCs, themed entertainment, and character appearances.
- Equipment and rentals: tables, chairs, generators, bounce houses, sound systems, speakers, lighting, special effects, and other configurable inventory.
- Event planning: customized party planning and curated experiences tailored to the customer's preferences.
Supported event types include birthdays, school events, daycare and preschool events, community events, family reunions, corporate family events, and holiday parties.
Target customer
The primary customer is an adult responsible for planning a children's or family event. They want to save time, understand their options, stay within a budget, and arrange entertainment and equipment through one provider.
The website should communicate:
- Convenience: entertainment and rentals can be coordinated in one place.
- Personalization: customers can describe the event and their preferences.
- Clarity: customers understand what happens after submitting a request.
- Trust: real business information, authentic media, clear terms, and responsive communication.
- No pressure: browsing and requesting a quote do not obligate the customer to book.
Business model
Custom quotes followed by a percentage deposit. The initial deposit is 25% of the accepted quote, configurable by the owner.
Do not invent public package prices or claim that every service has a fixed price. Public pages can display “Request a custom quote” or owner-approved starting prices when configured.

3. Website information architecture
The following pages are required. The implementation may use a different URL structure if the existing application already has an appropriate routing convention.
Page	Requirements
Home	Value proposition, featured services, party-builder CTA, trust content, service area, and contact information
Services & Rentals	Searchable or categorized listings for entertainment, equipment, and packages
Party Builder / Request a Quote	Guided event questionnaire, service selections, rental quantities, budget, and submission
About	Business introduction, approach, and mission
Gallery	Owner-managed event photos and videos, with appropriate usage permissions
Reviews	Authentic customer reviews, with sources where practical
FAQs	Answers about services, booking, deposits, rentals, logistics, cancellations, and weather
Contact	Contact methods, service area, and a clear route to request a quote
Blog / Promotions	Owner-published articles and seasonal offers
Privacy Policy	Explain collection, use, retention, and sharing of customer information
Terms & Booking Policies	Approved deposit, quote, cancellation, refund, rescheduling, rental, and delivery rules
Additional pages may be added when justified by customer needs or local SEO. Avoid automatically generating large numbers of near-identical location pages.
Conversion design requirements
- Every major service page should provide a clear way to start a quote.
- The party builder should be accessible from the home page and mobile navigation.
- The form should preserve entered information if the customer moves between its steps.
- The site must explain that quote requests are not confirmed bookings.
- Forms should show validation errors next to relevant fields.
- Avoid fake scarcity, invented reviews, deceptive countdowns, or misleading discounts.
- Use authentic photographs and videos as they become available.
4. Party builder and quote-request requirements
Required event information
The party builder must collect the following information, with required versus optional fields configurable where appropriate.
Field	Requirement
Event type	Required selection
Event date	Required
Start and end times	Required before final quote or booking confirmation
Event location	Required; collect enough address information to estimate travel
Venue type	Indoor, outdoor, or a suitable alternative such as mixed
Number and ages of children	Use child counts and age ranges rather than names or exact birth dates
Estimated guest count	Collect an estimate
Entertainment options	One or more selections
Rental equipment	Item selections and requested quantities
Theme and preferences	Optional free text and available structured choices
Budget range	Optional or required based on owner configuration
Food and decorations	Optional selections or notes
Special requests	Optional
Setup/teardown details	Capture event logistics relevant to the chosen package
Rental delivery or pickup	Support delivery/pickup and customer pickup where offered
The form should explain that availability and prices are subject to owner review. A customer must not be able to bypass server-side availability or pricing checks by editing browser values.
Contact and attribution information
Collect the following for the responsible adult:
- Name.
- Email address.
- Phone number.
- Preferred contact method.
- Event date and location.
- Estimated guest count.
- Selected services and rentals.
- Budget range.
- Notes and special requests.
- How they heard about the business.
Record marketing attribution when available, such as UTM parameters and referring page, while respecting applicable privacy choices. A manually selected “How did you hear about us?” answer should remain available as a fallback.
Submission behavior
When a valid quote request is submitted, the system must:
1. Validate and sanitize submitted data on the server.
2. Create a unique inquiry record.
3. Save the selected service and rental details as a snapshot so later catalog changes do not silently alter the original request.
4. Assign the status New inquiry.
5. Generate a unique reference number.
6. Send a customer acknowledgment email.
7. Alert the owner by email and SMS, using the configured notification provider.
8. Display a confirmation screen with the reference number and next steps.
9. Record notification outcomes for troubleshooting.
10. Avoid treating the request as an inventory reservation or confirmed booking.
If notification delivery fails, the inquiry should remain safely stored. The system should log the failure and support retrying instead of losing the lead.
Drafts and abandoned requests
Prefer local draft preservation during the initial implementation if it can be implemented safely. A future save-and-return feature can use a secure, expiring resume link.
Do not store children's personal details unnecessarily in drafts. A customer should not need to create an account to request a quote.

5. Quote management and booking lifecycle
Required quote statuses
Use the business's chosen statuses:
- New inquiry
- Quote in progress
- Quote sent
- Confirmed booking
- Completed
- Cancelled
Store payment status, expiration, and operational progress as separate fields rather than overloading the quote status.
For example, a quote can be Quote sent while its payment status is Unpaid. This makes reporting and workflow rules easier to maintain.
Quote creation and delivery
The owner must be able to:
- Review event details and requested services.
- Add, remove, and edit quote line items.
- Set quantities, unit prices, travel fees, discounts, taxes where applicable, and other approved charges.
- Record the quote total and required deposit.
- Add notes for the customer and private internal notes.
- Send the quote by email.
- View whether the quote was sent, delivered where delivery information is available, accepted, declined, or expired.
- Resend or revise a quote.
- View a history of quote changes.
Pricing is manual at launch. The system must not automatically finalize a price or promise availability without owner approval.
Seven-day quote expiration
- Quotes expire seven calendar days after their recorded issue timestamp.
- Store timestamps consistently, and display dates in the appropriate local time zone.
- Make the expiration date visible in the customer-facing quote.
- Mark expired quotes as no longer actionable, using an expiration field or lifecycle event instead of inventing a new required business status.
- After expiration, the customer must request renewed pricing and availability before proceeding.
- Expiration must be enforced on the server, not only through a frontend countdown.
- Resending or revising a quote must follow an explicit rule for resetting or retaining its expiration date.
Open decision: Confirm whether a revised or resent quote receives a new seven-day period. Recommended default: a newly issued revision gets its own seven-day expiration timestamp.
Booking confirmation workflow
#chatgpt-mermaid-_r_183_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(13, 13, 13);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_183_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_183_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_183_ .error-icon{fill:rgb(243, 243, 243);}#chatgpt-mermaid-_r_183_ .error-text{fill:rgb(13, 13, 13);stroke:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_183_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_183_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_183_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_183_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_183_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_183_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_183_ .marker.cross{stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_183_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_183_ p{margin:0;}#chatgpt-mermaid-_r_183_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .cluster-label text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .cluster-label span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_183_ .label text,#chatgpt-mermaid-_r_183_ span{fill:rgb(13, 13, 13);color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .node rect,#chatgpt-mermaid-_r_183_ .node circle,#chatgpt-mermaid-_r_183_ .node ellipse,#chatgpt-mermaid-_r_183_ .node polygon,#chatgpt-mermaid-_r_183_ .node path{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);stroke-width:1px;}#chatgpt-mermaid-_r_183_ .rough-node .label text,#chatgpt-mermaid-_r_183_ .node .label text,#chatgpt-mermaid-_r_183_ .image-shape .label,#chatgpt-mermaid-_r_183_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_183_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_183_ .rough-node .label,#chatgpt-mermaid-_r_183_ .node .label,#chatgpt-mermaid-_r_183_ .image-shape .label,#chatgpt-mermaid-_r_183_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_183_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_183_ .root .anchor path{fill:rgb(143, 143, 143)!important;stroke-width:0;stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_183_ .arrowheadPath{fill:rgb(143, 143, 143);}#chatgpt-mermaid-_r_183_ .edgePath .path{stroke:rgb(143, 143, 143);stroke-width:1px;}#chatgpt-mermaid-_r_183_ .flowchart-link{stroke:rgb(143, 143, 143);fill:none;}#chatgpt-mermaid-_r_183_ .edgeLabel{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_183_ .edgeLabel p{background-color:rgb(252, 252, 252);}#chatgpt-mermaid-_r_183_ .edgeLabel rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_183_ .labelBkg{background-color:rgba(252, 252, 252, 0.5);}#chatgpt-mermaid-_r_183_ .cluster rect{fill:rgb(243, 243, 243);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_183_ .cluster text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ .cluster span{color:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(243, 243, 243);border:1px solid rgba(0, 0, 0, 0.1);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_183_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(13, 13, 13);}#chatgpt-mermaid-_r_183_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_183_ .icon-shape,#chatgpt-mermaid-_r_183_ .image-shape{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-_r_183_ .icon-shape p,#chatgpt-mermaid-_r_183_ .image-shape p{background-color:rgb(252, 252, 252);padding:2px;}#chatgpt-mermaid-_r_183_ .icon-shape .label rect,#chatgpt-mermaid-_r_183_ .image-shape .label rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-_r_183_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_183_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_183_ .node .neo-node{stroke:rgb(83, 154, 248);}#chatgpt-mermaid-_r_183_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_183_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_183_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_183_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_183_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_183_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_183_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_183_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_183_ [data-look="neo"].node .neo-line path{stroke:rgb(83, 154, 248);filter:none;}#chatgpt-mermaid-_r_183_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_183_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_183_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_183_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_183_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_183_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_183_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_183_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_183_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(0, 79, 153);}#chatgpt-mermaid-_r_183_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_183_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_183_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-width:1px;}#chatgpt-mermaid-_r_183_ .node rect,#chatgpt-mermaid-_r_183_ .node circle,#chatgpt-mermaid-_r_183_ .node ellipse,#chatgpt-mermaid-_r_183_ .node polygon,#chatgpt-mermaid-_r_183_ .node path{fill:rgb(229, 243, 255);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_183_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_183_ .node.mermaid-decision .label-container{fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_183_ .edgePaths .flowchart-link{stroke:rgb(143, 143, 143);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_183_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-_r_183_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Customer submits quoterequestNew inquiryOwner reviews and preparesquoteQuote sent: expires in 7 daysCustomer accepts beforeexpiration?Expired or declinedCalculate 25% depositCustomer completes hostedcheckoutServer verifies successfulpaymentPending or failed payment; noconfirmationInventory still available?Do not confirm; resolvepayment and availabilityAtomically reserve inventoryConfirmed bookingSend confirmation andschedule remindersComplete event and requestreviewNoYesNoYesNoYes





The actual implementation must handle the possibility that inventory becomes unavailable while payment is processing. It must never silently confirm a booking that exceeds inventory.
Deposit calculation
Default deposit:
\[
\text{Deposit} = \text{Accepted quote total} \times 0.25
\]

- Store the approved percentage as an owner-configurable setting.
- Calculate currency using decimal-safe arithmetic or integer minor units, not floating-point calculations.
- Clearly define whether taxes and particular fees are included in the deposit base.
- Store the accepted quote version and deposit calculation so later edits do not change an existing payment obligation.
- Show the customer the quote total, deposit due, and remaining balance before payment.
Open decision: Determine when the remaining balance is due, whether partial payments are supported, and how tax and additional fees are included. Do not invent these rules.

6. Payment processing and financial records
Use a reputable payment provider with hosted checkout or equivalent secure payment collection. Do not build your own card-storage system.
Requirements
- The server creates payment sessions using the approved quote and deposit amount.
- The customer can pay only an amount authorized by the server.
- Verify signed payment webhooks and their event authenticity.
- Treat browser redirects as informational; a redirect alone is not proof of payment.
- Process duplicate webhooks idempotently.
- Store provider transaction references, amounts, currency, timestamps, and statuses.
- Maintain a record of refunds and the provider's refund identifiers.
- Keep payment secrets on the server.
- Do not log card numbers, security codes, or other payment credentials.
- Use sandbox/test payments before production.
- Make payment failures recoverable without creating duplicate bookings.
Payment status model
Recommended payment states include Unpaid, Pending, Paid, Partially refunded, Refunded, and Failed. The implementation may use provider-specific states as well, mapped into consistent internal states.
Important operational edge case: If payment succeeds but inventory cannot be reserved, the system must not simply discard the payment. It must flag the conflict for immediate resolution and follow an approved refund or alternative-date process.
Open decisions: Payment provider, remaining-balance collection, supported payment methods, chargeback handling, taxes, and payment/refund fee treatment.

7. Rental inventory and availability
Inventory is a high-priority data-integrity feature.
Requirements
Each rentable item should support:
- Name and description.
- Category.
- Images.
- Quantity owned or otherwise available for rental.
- Active/inactive status.
- Pricing model.
- Delivery/pickup eligibility.
- Setup requirements, where relevant.
- Maintenance or unavailable periods, if needed.
The system must account for event time intervals, not just event dates. It should define whether setup, teardown, transport, cleaning, or recovery time makes equipment unavailable beyond the customer-facing event times.
Preventing double bookings
Inventory must be checked and reserved by a server-side transaction or equivalent atomic mechanism.
Example: if the business owns 10 chairs and a confirmed booking needs 7 during a particular time interval, only 3 chairs remain available for overlapping bookings, unless an approved operational rule requires a buffer.
Requirements:
- Two concurrent requests cannot reserve the same inventory beyond the available quantity.
- Quote requests do not automatically block inventory.
- Only successful, verified deposits can trigger the confirmation process.
- Reservations are released or adjusted correctly when bookings are cancelled or rescheduled.
- The system must account for item quantities across all overlapping bookings.
- The owner can manually block equipment for maintenance or other operational reasons.
- Availability must be recalculated before confirmation.
- Failed payment attempts must not leave permanent inventory reservations.
- All reservation changes must be auditable.
Open decision: Whether a brief temporary inventory hold is needed while a customer is completing checkout. The current policy is to reserve inventory only after successful deposit payment and booking confirmation. A short hold may improve checkout reliability but would require a separate expiry and recovery rule.

8. Cancellations, refunds, and weather rescheduling
The business has chosen flexible cancellation with refunds based on costs already incurred. Weather-affected events may be rescheduled within 12 months if eligible.
These are business requirements, but they are not yet sufficiently precise to automate refund decisions without owner review.
Cancellation/refund workflow
The system must:
- Allow the owner to record cancellation requests and decisions.
- Record the date the request was received, reason, decision, and authorized refund amount.
- Track costs incurred, such as nonrecoverable third-party charges or expenses that qualify under the approved policy.
- Calculate a proposed refund only according to the approved rules.
- Require owner review and authorization before initiating a refund.
- Prevent a refund greater than the amount paid, less any prior refunds.
- Record refund requests, provider results, failures, and completion.
- Update booking and inventory records consistently.
- Send customers clear status notifications.
Do not allow AI to independently determine contractual refund eligibility or execute an unreviewed refund.
Weather policy
The system should support the following operational flow:
1. Customer or owner reports a weather-related issue.
2. Owner records the event conditions and determines whether the policy's eligibility criteria are met.
3. Eligible events can be moved to a new date within the permitted 12-month period.
4. The system checks availability at the new time before confirming the reschedule.
5. Inventory is transferred atomically from the original reservation to the new reservation.
6. Customer and owner receive updated confirmations.
7. If no suitable date is available, the case is escalated for an owner-approved resolution.
The website must not automatically promise a refund or reschedule solely because a weather API reports rain.
Policy decisions requiring approval
Before automated booking and refund operations go live, define:
- What counts as unsafe weather and who determines it.
- Whether official warnings, venue restrictions, or other conditions qualify.
- Notice deadlines and customer notification requirements.
- Exceptions, including customer-initiated cancellations unrelated to weather.
- Which costs can be deducted from a refund and how those costs are documented.
- Whether the deposit can be refunded in whole or in part.
- What happens when the business cannot provide a reschedule date within 12 months.
- What happens if the business cancels for reasons unrelated to weather.
- Whether the original booking terms or rescheduling terms govern a moved event.
These terms should be reviewed for applicable California and other relevant legal requirements before publication.

9. Event logistics and travel pricing
Required capabilities
- Setup and teardown are included in configured packages.
- Support event start and end times.
- Support indoor, outdoor, and mixed venues.
- Support delivery and pickup for eligible rental items.
- Allow customer pickup for selected rentals.
- Calculate travel fees based on distance.
- Allow the owner to review or override calculated travel fees in a quote.
- Support service-zone configuration and future delivery scheduling.
- Store operational notes for access, setup, parking, loading, and special arrangements.
- Support weather-related rescheduling.
Distance-based pricing
Use a configurable pricing rule rather than embedding a fixed rate in code. A suitable future design is:
travel fee = configured base fee + applicable distance charge
The actual formula, distance source, round-trip treatment, travel-time allowances, and service limits remain owner decisions.
The customer should see the approved travel charge in the quote before accepting it. The website must not guarantee delivery times or vehicle capacity based on the planned cargo van, which has not yet been acquired.

10. Owner dashboard and CMS
The owner is the only initial administrator. The application should support additional staff roles later without requiring a complete rewrite.
Dashboard modules
Inquiry and quote management
View, search, filter, update statuses, edit quote details, send quotes, and review communications.


Bookings and availability
View confirmed events, check overlapping reservations, manage cancellations, rescheduling, and item availability.


Services and rentals
Manage categories, descriptions, images, rental quantities, prices, availability, and pickup/delivery eligibility.


Content management
Edit homepage banners and calls to action, pages, package descriptions, FAQs, policies, blog posts, promotions, gallery media, and SEO metadata.


Reporting
Track quote requests, quote-to-booking conversion, lead sources, completed-booking revenue, repeat bookings, and notification outcomes.



CMS requirements
- Provide drafts and publishing controls for content where appropriate.
- Validate uploads and restrict file types and sizes.
- Optimize uploaded images for web delivery.
- Keep private notes and administrative data out of public pages.
- Support editable SEO titles, meta descriptions, canonical URLs where needed, and social-sharing metadata.
- Preserve useful URLs when content is edited.
- Support backups and restoration of critical content.
- Do not require a separate paid CMS if the current stack can safely support these capabilities.

11. Email, SMS, and automation
SMS is a launch requirement, alongside email.
Required launch notifications
Trigger	Customer notification	Owner notification
Quote request submitted	Confirmation email	Email and SMS alert
Quote sent	Quote email with expiration date	Record of sending
Quote nearing expiration	Reminder email, subject to configured rules	Optional dashboard alert
Quote expires	Expiration notice where appropriate	Status visible in dashboard
Deposit verified and booking confirmed	Email and SMS confirmation	Email and SMS alert
Upcoming confirmed event	Reminder email and SMS	Optional operational reminder
Cancellation/reschedule decision	Status update	Record of decision
Event completed	Review request email	Completion recorded
Also support reminders for customers who begin but do not finish a quote request, provided the system has a lawful basis and sufficient contact information to send the message.
Notification architecture
- Use a transactional email provider and an SMS provider with documented APIs.
- Send messages through server-side jobs or a reliable queue where supported.
- Store delivery attempts and provider message identifiers.
- Retry transient failures safely.
- Avoid sending duplicate messages when a webhook or scheduled job runs more than once.
- Make templates editable where practical.
- Allow the owner to test notifications.
- Support SMS consent, opt-out, and applicable sender identification and messaging requirements.
- Separate essential booking communications from promotional messages and respect applicable consent and unsubscribe rules.
Open decision: Select the email and SMS providers after inspecting the existing codebase and comparing cost, deliverability, coverage, and current pricing. Budget for per-message charges and registration requirements where applicable.

12. AI capabilities
AI is an expansion feature, not a prerequisite for accepting initial quote requests.
Customer-facing assistance
The system may help customers:
- Find services appropriate to their event type.
- Choose age-appropriate games and entertainment.
- Suggest themes and sample itineraries.
- Consider options that fit their stated budget.
- Find answers from approved business FAQs and policies.
Owner-facing assistance
The system may help draft:
- Personalized quote descriptions.
- Follow-up emails.
- Event suggestions and package combinations.
- Responses to common questions.
Safety and accuracy requirements
- Ground answers in owner-approved services, pricing rules, FAQs, and policies.
- Never invent availability, prices, discounts, legal terms, or service guarantees.
- Make clear when a recommendation is an estimate rather than a confirmed quote.
- Require owner approval for prices, contractual terms, refunds, and unusual commitments.
- Minimize the personal data sent to an AI provider.
- Do not send children's identifying information to an AI service unless there is a specific, approved and lawful necessity.
- Log failures without storing unnecessary sensitive information.
- Provide a non-AI path to complete every essential customer workflow.

13. Recommended data architecture
The repository audit must determine whether the project already has an appropriate database and backend. If a change is needed, prefer a managed relational database, such as PostgreSQL, with server-side transactional operations.
A proposed logical model follows.
Entity	Purpose
users / admin_users	Owner and future staff identities and permissions
customers	Adult customer contact information and communication preferences
services	Entertainment and planning service catalog
packages	Configurable bundles and package descriptions
rental_items	Rental inventory, quantities, and rental rules
quote_requests	Submitted event details and attribution
quotes	Quote version, issue time, expiry, acceptance, and totals
quote_line_items	Price and quantity snapshots for each quote item
bookings	Confirmed event details and booking lifecycle
inventory_reservations	Item quantities reserved over specific time intervals
payments	Payment provider references and payment states
refunds	Authorized refunds and provider outcomes
notifications	Message templates, attempts, and delivery status
content_pages	Editable pages, policies, FAQs, promotions, and metadata
media_assets	Image/video references and publishing information
audit_logs	Important owner actions and financial/booking changes
business_settings	Deposit percentage, quote duration, travel rules, and other configurable settings
These are logical entities, not a demand to create tables with exactly these names. Existing database conventions and relationships should be preserved where appropriate.
Essential integrity requirements
- Use foreign keys and database constraints where appropriate.
- Store money in integer minor units or an equivalent decimal-safe representation.
- Store timestamps consistently and handle the event's local time zone correctly.
- Use transactions and appropriate locking or constraints for inventory reservations.
- Snapshot quote pricing and accepted terms.
- Make payment events idempotent.
- Keep audit history for important quote, payment, booking, cancellation, and refund actions.
- Ensure that removing a service from the public catalog does not erase historical quote and booking details.

14. Security, privacy, accessibility, and SEO
Security
The application must:
- Protect every admin page and administrative API with server-enforced authorization.
- Validate all inputs on the server.
- Rate-limit forms and authentication attempts.
- Apply spam protection to public submissions.
- Store secrets only in appropriate server-side configuration.
- Use HTTPS and secure session/cookie settings.
- Validate uploaded media.
- Verify signed payment webhooks.
- Use least-privilege access and appropriate database permissions.
- Maintain dependency updates and security checks.
- Provide backup and recovery procedures.
- Avoid logging secrets, payment credentials, or unnecessary personal data.
Privacy and children's information
The site is intended for adults planning events, not for children to create accounts or profiles.
- Request adult contact information for the inquiry.
- Prefer child age ranges and counts instead of names or exact birth dates.
- Do not request children's personal information unless a specific operational need has been approved.
- Provide a privacy notice describing collection, use, retention, sharing, and deletion.
- Collect explicit, separate consent where required for promotional communications.
- Obtain appropriate permission before publishing identifiable event photos or videos.
- Restrict access to customer records and define retention periods.
- Assess applicable privacy, children's-data, and communication laws before launch.
Accessibility and performance
- Support mobile, tablet, and desktop layouts.
- Use semantic headings, labels, keyboard-accessible navigation, visible focus states, and appropriate contrast.
- Provide meaningful alternative text for informative images.
- Avoid relying on color alone to communicate status.
- Optimize image sizes, loading behavior, fonts, and third-party scripts.
- Test forms with keyboard navigation and screen readers where practical.
- Target Core Web Vitals and other performance metrics appropriate to the framework, while measuring actual results rather than claiming compliance without testing.
SEO and discoverability
- Unique titles and meta descriptions for meaningful pages.
- Descriptive URLs and internal links.
- XML sitemap and correct robots directives.
- Canonical URLs when duplicate content is possible.
- Appropriate structured data only when it accurately represents the business.
- Local business details that match the real business information.
- A Google Business Profile link and a consistent process for collecting genuine reviews.
- Relevant service-area pages only where they provide useful, distinct information.
- Analytics and Search Console integration.
- Accurate event photos and descriptive image text.

15. Analytics and success metrics
The system should support the following metrics from launch or as soon as the underlying workflow exists.
Metric	Definition
Quote requests	Number of valid, non-spam quote submissions in a selected period
Qualified quote requests	Requests that meet owner-defined qualification criteria
Quote-to-booking conversion	Confirmed bookings divided by quotes issued within a defined reporting cohort
Lead source	Original attribution and customer-reported source where available
Completed-booking revenue	Revenue recorded for completed events, with refunds and adjustments clearly accounted for
Repeat booking rate	Customers with more than one qualifying booking over a defined period
Quote response time	Time between submission and first owner response or quote
Notification success	Successful delivery outcomes where provider data is available
Avoid treating payment authorization, deposits, final revenue, and completed-event revenue as the same metric. Reporting definitions must be documented so the dashboard does not overstate business performance.
Use privacy-conscious analytics settings and avoid placing customer names, email addresses, phone numbers, or children's information in analytics event parameters.

16. Testing and release acceptance criteria
The project is not ready for production simply because the pages render or the development server starts.
Required tests
Quote submission
A valid submission is saved once, gets a reference number, and triggers the intended customer and owner notifications.


Validation and abuse
Invalid fields, malformed requests, spam attempts, and excessive submissions are handled safely.


Admin security
Unauthenticated users cannot access the dashboard; unauthorized users cannot modify business data.


Quote expiration
A quote becomes non-actionable after seven days, using server-side time and approved revision rules.


Deposit calculation
A 25% deposit is calculated correctly from the approved quote total and configured deposit basis.


Payment verification
A browser redirect alone cannot confirm payment; only verified provider events can do so.


Duplicate events
Repeated payment webhooks do not create duplicate payments, reservations, or booking confirmations.


Inventory concurrency
Concurrent attempts cannot reserve more units than exist during overlapping time periods.


Failed payments
Failed or pending payments do not incorrectly confirm bookings.


Cancellation/refunds
Refunds cannot exceed the amount paid less prior refunds; policy-dependent outcomes require owner authorization.


Rescheduling
A new date is availability-checked and inventory is transferred without a double-booking gap.


CMS isolation
Public visitors cannot access private CMS functions or unpublished content.


Email and SMS
Messages use approved templates, handle provider failures, respect opt-outs, and avoid duplicate sends.


Accessibility and SEO
Core pages work on mobile, forms have labels and useful errors, and metadata is correct.



Deployment checklist
Before launch:
- Run existing tests, lint, type checks, and production build.
- Review the final environment configuration without exposing secrets.
- Test email and SMS delivery.
- Test payment provider sandbox flows and signed webhooks.
- Test concurrent inventory booking.
- Verify backups and document restoration steps.
- Confirm privacy, cancellation, refund, weather, and rental terms have been approved.
- Verify mobile layout, key pages, forms, analytics, and SEO.
- Configure the domain, HTTPS, business email authentication, and monitoring.
- Confirm that no unfinished payment or booking flow is presented as fully operational.

17. Phased implementation plan
The repository audit should revise this plan based on the actual project state.
Phase	Deliverables	Completion criteria
0. Audit and foundations	Read-only codebase audit, gap analysis, architecture decision, security review	Existing stack and risks documented; no destructive changes
1. Lead generation	Public pages, service catalog, party builder, quote submission, email/SMS alerts, basic SEO	Valid inquiries reliably reach the owner and receive customer acknowledgment
2. Owner operations	Secure dashboard, CMS, quote lifecycle, seven-day expiry, manual quote generation	Owner can manage content and inquiries without editing code
3. Payments and booking	Configurable 25% deposit, hosted checkout, verified payment events, inventory reservation	Deposits and bookings are recorded safely; concurrent double bookings are prevented
4. Event operations	Cancellation/refund records, weather rescheduling, reminders, distance fees and delivery workflow	Approved policies are enforced and operational changes remain auditable
5. Growth	Analytics, review requests, customer retention, advanced automation and AI assistance	Metrics are reliable and new automation does not bypass existing safeguards
The full CMS is part of the product requirements, but its implementation can be phased. The owner should not have to edit source code to change everyday business content after the CMS is delivered.
18. Remaining owner decisions and policy/legal blockers
The following are still unresolved. They should be documented in a decision register rather than guessed by the development agent.
Blocker
Cancellation and refund terms
Define deductible costs, evidence, timing, exceptions, deposit treatment, business-initiated cancellations, and the approval process. Obtain appropriate legal review before enabling automated refund decisions.



Blocker
Weather eligibility
Define unsafe conditions, decision authority, notice rules, and what happens if rescheduling within 12 months is impossible. Do not let AI or a weather API decide contractual eligibility independently.



Blocker
Payment and deposit terms
Choose the payment provider; define the deposit basis, remaining balance due date, partial payments, applicable taxes, and payment/refund fee treatment.



Needed before booking launch
Inventory and quote rules
Decide whether revised quotes restart the seven-day period, whether temporary checkout holds are ever needed, and how setup, teardown, transport, and cleaning affect rental availability.



Needed before launch
Travel pricing and delivery
Approve the distance formula, round-trip treatment, service limits, pickup eligibility, and current delivery arrangements.



Needed before messaging launch
SMS, email, and privacy compliance
Select providers, define customer consent and opt-out behavior, and confirm applicable messaging, privacy, and data-retention obligations.



Can be decided during implementation
Brand and marketing setup
Choose the domain, logo, color palette, brand voice, initial service-area priorities, approved imagery, and the business email address.
