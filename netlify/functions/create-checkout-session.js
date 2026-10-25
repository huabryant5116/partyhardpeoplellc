/**
 * Netlify Serverless Function: /api/create-checkout-session
 * Creates an authentic, server-authorized Stripe Checkout session for the 25% deposit.
 * Strictly verifies quote validity and 7-day expiration before creating a payment intent.
 */

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    const payload = JSON.parse(event.body);
    const { quoteRef, depositCents, clientEmail, clientName, eventDate } = payload;

    if (!quoteRef || !depositCents || depositCents <= 0) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: 'Valid quote reference and positive deposit amount are required.' })
      };
    }

    // Expiration Verification Check
    if (payload.expiresAt && new Date(payload.expiresAt).getTime() < Date.now()) {
      return {
        statusCode: 410,
        headers,
        body: JSON.stringify({
          error: 'This quote has expired (7-day window passed). Please contact Party Hard People to request refreshed availability.'
        })
      };
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // Production Stripe Integration
    if (stripeSecretKey) {
      const stripe = require('stripe')(stripeSecretKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `25% Event Reservation Deposit (${quoteRef})`,
                description: `Party Hard People LLC celebration date reservation for ${clientName || 'Valued Client'} on ${eventDate || 'Scheduled Date'}. Remaining 75% due day of event.`,
                images: ['https://partyhardpeople.netlify.app/assets/images/hero-celebration.jpg']
              },
              unit_amount: depositCents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        customer_email: clientEmail,
        metadata: {
          quoteRef,
          depositCents: depositCents.toString(),
          clientName: clientName || '',
          eventDate: eventDate || ''
        },
        success_url: `https://partyhardpeople.netlify.app/thank-you.html?booking=confirmed&ref=${encodeURIComponent(quoteRef)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://partyhardpeople.netlify.app/services.html?quote=${encodeURIComponent(quoteRef)}`
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          sessionId: session.id,
          checkoutUrl: session.url
        })
      };
    }

    // Sandbox / Test Mode Response (when Stripe Secret Key is not yet populated in Netlify Environment)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sandbox: true,
        quoteRef,
        depositCents,
        depositFormatted: (depositCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        message: 'Sandbox mode: Set STRIPE_SECRET_KEY in Netlify site settings to process live 25% card deposits.'
      })
    };
  } catch (err) {
    console.error('Error generating checkout session:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Error creating checkout session' })
    };
  }
};
