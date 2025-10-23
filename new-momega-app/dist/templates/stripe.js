"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStripeFiles = generateStripeFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generateStripeFiles(config) {
    if (!config.features.stripe)
        return;
    const { projectPath } = config;
    // Generate Stripe API routes
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'app', 'api', 'stripe'));
    // Create checkout session route
    const checkoutRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true\`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'api', 'stripe', 'checkout', 'route.ts'), checkoutRouteContent);
    // Create webhook route
    const webhookRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        // Handle successful payment
        break;
      
      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        // Handle new subscription
        break;
      
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', updatedSubscription.id);
        // Handle subscription update
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', deletedSubscription.id);
        // Handle subscription cancellation
        break;
      
      default:
        console.log(\`Unhandled event type: \${event.type}\`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'api', 'stripe', 'webhook', 'route.ts'), webhookRouteContent);
    // Generate pricing page
    const pricingPageContent = `'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  {
    name: 'Basic',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Up to 5 projects',
      'Basic support',
      'Community access',
    ],
    priceId: null,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For growing teams',
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
    ],
    priceId: 'price_pro_monthly',
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    priceId: 'price_enterprise_monthly',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      // Handle free plan
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative"
          >
            {plan.name === 'Pro' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">\${plan.price}</span>
              <span className="text-gray-600 dark:text-gray-300">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.priceId)}
              disabled={loading === plan.priceId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading === plan.priceId ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'pricing', 'page.tsx'), pricingPageContent);
    // Generate Stripe utility functions
    const stripeUtilsContent = `import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(priceId: string, customerId?: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true\`,
    customer: customerId,
  });

  return session;
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'lib', 'stripe.ts'), stripeUtilsContent);
}
//# sourceMappingURL=stripe.js.map