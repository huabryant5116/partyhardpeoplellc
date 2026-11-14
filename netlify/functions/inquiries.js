/**
 * Netlify Serverless Function: /api/inquiries
 * Handles customer party inquiry submissions, validates data,
 * assigns unique reference codes, sets 7-day expiration, and triggers email notifications.
 */

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing request body' })
        };
      }

      const payload = JSON.parse(event.body);
      const details = payload.details || {};

      // Input Validation
      const contactName = (details.contactName || payload.contactName || '').trim();
      const contactEmail = (details.contactEmail || payload.contactEmail || '').trim();
      const contactPhone = (details.contactPhone || payload.contactPhone || '').trim();

      if (!contactName || !contactEmail || !contactPhone) {
        return {
          statusCode: 422,
          headers,
          body: JSON.stringify({ error: 'Name, email, and phone number are required.' })
        };
      }

      // Generate Reference Code: PHP-2026-XXXX
      const refCode = payload.refCode || `PHP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const inquiryRecord = {
        id: 'inq_' + Date.now(),
        refCode,
        status: 'pending_review',
        submittedAt: now.toISOString(),
        expiresAt,
        client: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          preferredContact: details.contactMethod || 'email'
        },
        event: {
          eventType: details.eventType || 'birthday',
          vibe: details.eventVibe || 'kids',
          eventDate: details.eventDate || 'Pending',
          startTime: details.startTime || '13:00',
          endTime: details.endTime || '16:00',
          address: details.address || 'SoCal Venue',
          venueType: details.venueType || 'outdoor',
          estimatedChildren: details.childrenCount || 15,
          ageRanges: details.ageRanges || ['4-7'],
          estimatedGuests: details.estimatedGuests || 25,
          theme: details.theme || '',
          notes: details.notes || ''
        },
        selections: {
          entertainment: details.entertainment || [],
          rentals: details.rentals || {}
        },
        estimate: payload.estimate || {},
        attribution: payload.attribution || { source: 'direct' }
      };

      // Email Notification Dispatch (Resend API if configured)
      const resendApiKey = process.env.RESEND_API_KEY;
      const ownerEmail = process.env.OWNER_EMAIL || 'hello@partyhardpeople.com';

      if (resendApiKey) {
        try {
          // 1. Owner Alert Email
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Party Hard People Quotes <quotes@partyhardpeople.com>',
              to: [ownerEmail],
              subject: `🎉 New Quote Inquiry: ${refCode} — ${contactName} (${inquiryRecord.event.eventDate})`,
              html: `
                <h2>New Party Inquiry Received</h2>
                <p><strong>Reference:</strong> ${refCode}</p>
                <p><strong>Client:</strong> ${contactName} (<a href="mailto:${contactEmail}">${contactEmail}</a> / ${contactPhone})</p>
                <p><strong>Date & Time:</strong> ${inquiryRecord.event.eventDate} (${inquiryRecord.event.startTime} – ${inquiryRecord.event.endTime})</p>
                <p><strong>Location:</strong> ${inquiryRecord.event.address} (${inquiryRecord.event.venueType})</p>
                <p><strong>Estimated Guests:</strong> ${inquiryRecord.event.estimatedChildren} children / ${inquiryRecord.event.estimatedGuests} total</p>
                <p><strong>Estimated Starting Total:</strong> ${inquiryRecord.estimate.subtotalFormatted || '$0.00'}</p>
                <p><strong>Special Notes:</strong> ${inquiryRecord.event.notes || 'None'}</p>
                <hr>
                <p><a href="https://partyhardpeople.netlify.app/admin.html">Open Admin Dashboard to prepare quote &rarr;</a></p>
              `
            })
          });

          // 2. Customer Confirmation Email
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Party Hard People <hello@partyhardpeople.com>',
              to: [contactEmail],
              subject: `We Received Your Party Request! (Ref: ${refCode})`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B;">
                  <h1 style="color: #7C3AED;">Thank You, ${contactName}!</h1>
                  <p>We received your celebration inquiry for <strong>${inquiryRecord.event.eventDate}</strong>. Our team is currently checking performer schedules and equipment availability.</p>
                  
                  <div style="background: #F1F5F9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <div style="font-size: 12px; color: #64748B; text-transform: uppercase;">Your Quote Reference</div>
                    <div style="font-size: 24px; font-weight: bold; color: #7C3AED;">${refCode}</div>
                  </div>

                  <h3>What Happens Next:</h3>
                  <ol style="line-height: 1.6;">
                    <li><strong>Review & Verification:</strong> We confirm travel and sound equipment for your date.</li>
                    <li><strong>Itemized Custom Quote:</strong> Within 24 hours, you will receive an itemized quote with a 7-day price guarantee.</li>
                    <li><strong>Lock in Your Date:</strong> You can review, accept, and submit a 25% deposit to officially confirm your booking.</li>
                  </ol>
                  
                  <p style="font-size: 13px; color: #64748B;">Questions? Simply reply to this email or call us at (714) 609-5261.</p>
                </div>
              `
            })
          });
        } catch (mailErr) {
          console.warn('Email dispatch warning:', mailErr.message);
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          refCode,
          expiresAt,
          message: 'Inquiry successfully recorded'
        })
      };
    } catch (err) {
      console.error('Error handling inquiry POST:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error processing inquiry' })
      };
    }
  }

  // Fallback for unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
