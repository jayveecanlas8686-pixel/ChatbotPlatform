/* ============================================================
   ChatBot AI Platform - Demo Data Initialization
   ============================================================ */

const CB = {
  KEYS: {
    users: 'cb_users',
    currentUser: 'cb_current_user',
    conversations: 'cb_conversations',
    tickets: 'cb_tickets',
    articles: 'cb_articles',
    botSettings: 'cb_bot_settings',
    integrations: 'cb_integrations',
    team: 'cb_team',
    settings: 'cb_settings',
    chatHistory: 'cb_chat_history',
    analytics: 'cb_analytics',
    billing: 'cb_billing',
    notifications: 'cb_notifications',
  },

  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(key); },

  initDemo() {
    if (CB.get(CB.KEYS.users)) return;
    CB.set(CB.KEYS.users, CB.DEMO.users);
    CB.set(CB.KEYS.conversations, CB.DEMO.conversations);
    CB.set(CB.KEYS.tickets, CB.DEMO.tickets);
    CB.set(CB.KEYS.articles, CB.DEMO.articles);
    CB.set(CB.KEYS.botSettings, CB.DEMO.botSettings);
    CB.set(CB.KEYS.integrations, CB.DEMO.integrations);
    CB.set(CB.KEYS.team, CB.DEMO.team);
    CB.set(CB.KEYS.settings, CB.DEMO.settings);
    CB.set(CB.KEYS.analytics, CB.DEMO.analytics);
    CB.set(CB.KEYS.billing, CB.DEMO.billing);
    CB.set(CB.KEYS.notifications, CB.DEMO.notifications);
    console.log('Demo data initialized');
  },

  resetDemo() {
    Object.values(CB.KEYS).forEach(k => { if (k !== CB.KEYS.currentUser) CB.remove(k); });
    CB.initDemo();
  }
};

CB.DEMO = {
  users: [
    { id: 'u1', name: 'Alex Johnson', email: 'admin@example.com', password: 'password123', role: 'admin', avatar: 'AJ', company: 'TechCorp Inc.', createdAt: '2024-01-15' },
    { id: 'u2', name: 'Sarah Chen', email: 'agent@example.com', password: 'password123', role: 'agent', avatar: 'SC', company: 'TechCorp Inc.', createdAt: '2024-02-10' },
    { id: 'u3', name: 'Marcus Rivera', email: 'owner@example.com', password: 'password123', role: 'owner', avatar: 'MR', company: 'TechCorp Inc.', createdAt: '2024-01-01' },
  ],

  conversations: [
    { id: 'c1', customerName: 'Emily Watson', customerEmail: 'emily@gmail.com', status: 'open', assignedTo: 'u2', channel: 'web', startedAt: '2024-06-07T09:15:00', lastMessage: 'Can you help me reset my password?', unread: true,
      messages: [
        { id: 'm1', sender: 'customer', text: 'Hello, I need help with my account', time: '2024-06-07T09:15:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'Hi Emily! I\'m here to help. What seems to be the issue with your account?', time: '2024-06-07T09:15:05', type: 'inbound' },
        { id: 'm3', sender: 'customer', text: 'Can you help me reset my password?', time: '2024-06-07T09:16:00', type: 'inbound' },
      ]
    },
    { id: 'c2', customerName: 'James Park', customerEmail: 'james@company.com', status: 'open', assignedTo: 'u2', channel: 'web', startedAt: '2024-06-07T08:30:00', lastMessage: 'I want to upgrade my plan', unread: true,
      messages: [
        { id: 'm1', sender: 'customer', text: 'I want to upgrade my plan', time: '2024-06-07T08:30:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'Great! I can help you with that. We offer Starter, Professional, and Enterprise plans. Which one are you interested in?', time: '2024-06-07T08:30:05', type: 'inbound' },
        { id: 'm3', sender: 'agent', text: 'Hi James! Let me walk you through our plans. The Professional plan at $49/mo is most popular for growing businesses.', time: '2024-06-07T08:35:00', type: 'outbound', agentName: 'Sarah Chen' },
      ]
    },
    { id: 'c3', customerName: 'Linda Gomez', customerEmail: 'linda@shop.com', status: 'resolved', assignedTo: 'u2', channel: 'messenger', startedAt: '2024-06-06T14:20:00', lastMessage: 'Thank you so much!', unread: false,
      messages: [
        { id: 'm1', sender: 'customer', text: 'What are your business hours?', time: '2024-06-06T14:20:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'Our business hours are Monday-Friday 9AM-6PM EST. Is there anything else I can help you with?', time: '2024-06-06T14:20:05', type: 'inbound' },
        { id: 'm3', sender: 'customer', text: 'Thank you so much!', time: '2024-06-06T14:21:00', type: 'inbound' },
      ]
    },
    { id: 'c4', customerName: 'Tom Bradley', customerEmail: 'tom@enterprise.io', status: 'open', assignedTo: null, channel: 'web', startedAt: '2024-06-07T10:05:00', lastMessage: 'I have a billing question', unread: true,
      messages: [
        { id: 'm1', sender: 'customer', text: 'I have a billing question', time: '2024-06-07T10:05:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'I\'d be happy to help with billing! Could you tell me more about your question?', time: '2024-06-07T10:05:05', type: 'inbound' },
      ]
    },
    { id: 'c5', customerName: 'Rachel Kim', customerEmail: 'rachel@startup.co', status: 'resolved', assignedTo: 'u2', channel: 'whatsapp', startedAt: '2024-06-06T11:00:00', lastMessage: 'Perfect, all sorted!', unread: false,
      messages: [
        { id: 'm1', sender: 'customer', text: 'How do I integrate with Shopify?', time: '2024-06-06T11:00:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'You can integrate with Shopify through our Integrations page. Go to Settings > Integrations > Shopify and follow the setup wizard.', time: '2024-06-06T11:00:05', type: 'inbound' },
        { id: 'm3', sender: 'customer', text: 'Perfect, all sorted!', time: '2024-06-06T11:05:00', type: 'inbound' },
      ]
    },
    { id: 'c6', customerName: 'David Chen', customerEmail: 'david@techco.com', status: 'open', assignedTo: 'u1', channel: 'slack', startedAt: '2024-06-07T07:45:00', lastMessage: 'Getting an error on checkout', unread: false,
      messages: [
        { id: 'm1', sender: 'customer', text: 'Getting an error on checkout', time: '2024-06-07T07:45:00', type: 'inbound' },
        { id: 'm2', sender: 'bot', text: 'I\'m sorry to hear that! Can you describe the error message you\'re seeing?', time: '2024-06-07T07:45:05', type: 'inbound' },
      ]
    },
  ],

  tickets: [
    { id: 't1', ticketNo: 'TKT-001', subject: 'Cannot login to account', customerName: 'Emily Watson', customerEmail: 'emily@gmail.com', status: 'open', priority: 'high', category: 'Account', assignedTo: 'u2', createdAt: '2024-06-07T09:16:00', updatedAt: '2024-06-07T09:16:00', description: 'Customer is unable to login. Getting "Invalid password" error even after reset.', conversationId: 'c1', notes: [] },
    { id: 't2', ticketNo: 'TKT-002', subject: 'Request to upgrade plan to Enterprise', customerName: 'James Park', customerEmail: 'james@company.com', status: 'in_progress', priority: 'medium', category: 'Billing', assignedTo: 'u2', createdAt: '2024-06-07T08:32:00', updatedAt: '2024-06-07T09:00:00', description: 'Customer wants to upgrade from Professional to Enterprise plan. Needs custom pricing.', conversationId: 'c2', notes: [{ text: 'Emailed pricing sheet to customer', author: 'Sarah Chen', time: '2024-06-07T09:00:00' }] },
    { id: 't3', ticketNo: 'TKT-003', subject: 'Chatbot not responding on mobile', customerName: 'Michael Torres', customerEmail: 'michael@retail.com', status: 'open', priority: 'urgent', category: 'Technical', assignedTo: null, createdAt: '2024-06-06T16:00:00', updatedAt: '2024-06-06T16:00:00', description: 'The chatbot widget is not loading on iOS Safari. Works fine on desktop.', conversationId: null, notes: [] },
    { id: 't4', ticketNo: 'TKT-004', subject: 'Wrong invoice amount', customerName: 'Angela Foster', customerEmail: 'angela@biz.net', status: 'resolved', priority: 'high', category: 'Billing', assignedTo: 'u1', createdAt: '2024-06-05T10:30:00', updatedAt: '2024-06-06T14:00:00', description: 'Customer was charged twice for June subscription.', conversationId: null, notes: [{ text: 'Issued refund for duplicate charge', author: 'Alex Johnson', time: '2024-06-06T14:00:00' }] },
    { id: 't5', ticketNo: 'TKT-005', subject: 'Integration with Slack not working', customerName: 'Kevin Lee', customerEmail: 'kevin@devteam.io', status: 'in_progress', priority: 'medium', category: 'Integration', assignedTo: 'u2', createdAt: '2024-06-06T13:00:00', updatedAt: '2024-06-07T08:00:00', description: 'Slack notifications are not being sent when new tickets are created.', conversationId: null, notes: [] },
    { id: 't6', ticketNo: 'TKT-006', subject: 'Request for custom bot training data', customerName: 'Sara Williams', customerEmail: 'sara@ecommerce.co', status: 'open', priority: 'low', category: 'Feature Request', assignedTo: null, createdAt: '2024-06-05T09:00:00', updatedAt: '2024-06-05T09:00:00', description: 'Customer wants to upload custom product data for bot to reference.', conversationId: null, notes: [] },
    { id: 't7', ticketNo: 'TKT-007', subject: 'How to export conversation history', customerName: 'Tom Bradley', customerEmail: 'tom@enterprise.io', status: 'resolved', priority: 'low', category: 'General', assignedTo: 'u2', createdAt: '2024-06-04T11:00:00', updatedAt: '2024-06-04T15:00:00', description: 'Customer needs CSV export of all conversations for Q2 report.', conversationId: 'c4', notes: [] },
    { id: 't8', ticketNo: 'TKT-008', subject: 'Bot giving wrong answers about pricing', customerName: 'Rachel Kim', customerEmail: 'rachel@startup.co', status: 'open', priority: 'high', category: 'Bot Issue', assignedTo: 'u1', createdAt: '2024-06-07T06:00:00', updatedAt: '2024-06-07T06:00:00', description: 'The chatbot is quoting old pricing. Knowledge base needs to be updated.', conversationId: null, notes: [] },
  ],

  articles: [
    { id: 'a1', title: 'How to reset your password', category: 'Account', content: 'To reset your password: 1. Click "Forgot Password" on the login page. 2. Enter your email address. 3. Check your email for a reset link. 4. Click the link and enter a new password. 5. Log in with your new password. If you don\'t receive the email within 5 minutes, check your spam folder.', status: 'published', views: 1243, helpful: 89, createdAt: '2024-01-20', updatedAt: '2024-06-01', tags: ['password', 'account', 'login'] },
    { id: 'a2', title: 'Getting started with chatbot setup', category: 'Setup', content: 'Welcome to ChatBot AI! Here\'s how to get started: 1. Complete your profile in Settings. 2. Go to Bot Builder to customize your bot\'s name and greeting. 3. Add FAQ articles to your Knowledge Base. 4. Install the chat widget on your website. 5. Test your bot using the Demo page. Your bot will automatically use your FAQ articles to answer questions.', status: 'published', views: 2891, helpful: 97, createdAt: '2024-01-15', updatedAt: '2024-06-01', tags: ['setup', 'getting started', 'chatbot'] },
    { id: 'a3', title: 'Understanding pricing plans', category: 'Billing', content: 'We offer three plans: Starter ($0/month) - 500 conversations/month, 1 bot, basic analytics. Professional ($49/month) - 5,000 conversations/month, 3 bots, advanced analytics, integrations. Enterprise ($149/month) - Unlimited conversations, unlimited bots, custom integrations, dedicated support. All plans include a 14-day free trial. Upgrade or downgrade anytime from your Billing page.', status: 'published', views: 3456, helpful: 92, createdAt: '2024-01-15', updatedAt: '2024-05-15', tags: ['pricing', 'billing', 'plans'] },
    { id: 'a4', title: 'How to integrate with Shopify', category: 'Integration', content: 'To connect ChatBot AI with Shopify: 1. Go to Integrations in your dashboard. 2. Click "Connect" next to Shopify. 3. Enter your Shopify store URL. 4. Click "Authorize" and log in to Shopify. 5. Select the permissions you want to grant. 6. The integration will sync your products automatically. Your chatbot can then answer product and order questions.', status: 'published', views: 876, helpful: 88, createdAt: '2024-02-05', updatedAt: '2024-05-20', tags: ['shopify', 'ecommerce', 'integration'] },
    { id: 'a5', title: 'Business hours and availability', category: 'General', content: 'Our support team is available Monday through Friday, 9:00 AM to 6:00 PM Eastern Time. Outside these hours, our AI chatbot is available 24/7 to answer common questions. For urgent issues, use the "Urgent" priority when creating a ticket. Enterprise plan customers have access to 24/7 priority support.', status: 'published', views: 654, helpful: 85, createdAt: '2024-01-25', updatedAt: '2024-06-01', tags: ['hours', 'support', 'availability'] },
    { id: 'a6', title: 'How to create and manage tickets', category: 'Support', content: 'Creating a support ticket: 1. Go to Tickets in your dashboard. 2. Click "New Ticket". 3. Fill in the subject, description, priority, and category. 4. Click "Create Ticket". Managing tickets: You can filter by status, priority, and category. Assign tickets to team members. Add internal notes that customers can\'t see. Update ticket status as you work on it.', status: 'published', views: 432, helpful: 91, createdAt: '2024-02-10', updatedAt: '2024-05-30', tags: ['tickets', 'support', 'workflow'] },
    { id: 'a7', title: 'Chatbot widget installation guide', category: 'Setup', content: 'To install the chat widget on your website: Copy the embed code from Settings > Widget. Paste it before the closing </body> tag on your website. The widget will appear automatically. WordPress users: Install our official WordPress plugin. Shopify users: Use the Shopify integration. The widget color and greeting message can be customized in Bot Builder.', status: 'published', views: 1987, helpful: 94, createdAt: '2024-01-20', updatedAt: '2024-06-01', tags: ['widget', 'installation', 'website'] },
    { id: 'a8', title: 'Team management and roles', category: 'Account', content: 'ChatBot AI supports three user roles: Admin - Full access to all features, billing, team management. Agent - Can handle conversations, create and manage tickets, view analytics. Viewer - Read-only access to conversations and reports. To add a team member: Go to Team > Add Member. Enter their email and select their role. They\'ll receive an invitation email.', status: 'published', views: 567, helpful: 87, createdAt: '2024-02-15', updatedAt: '2024-05-25', tags: ['team', 'roles', 'permissions'] },
    { id: 'a9', title: 'Refund and cancellation policy', category: 'Billing', content: 'Refunds: We offer a 30-day money-back guarantee for all paid plans. To request a refund, contact support@chatbotai.com with your account email. Cancellation: Cancel anytime from Billing > Cancel Plan. Your service continues until the end of the billing period. No partial refunds for mid-cycle cancellations unless under the 30-day guarantee.', status: 'published', views: 892, helpful: 82, createdAt: '2024-01-25', updatedAt: '2024-05-01', tags: ['refund', 'cancel', 'billing'] },
    { id: 'a10', title: 'How to use the bot builder', category: 'Setup', content: 'The Bot Builder lets you customize your AI chatbot: Bot Identity: Set your bot\'s name, greeting message, and avatar color. Suggested Questions: Add quick-reply buttons that appear when the chat starts. Conversation Flows: Create rule-based responses for common questions. Fallback Response: What the bot says when it doesn\'t understand. Remember to save and preview changes before publishing.', status: 'published', views: 1234, helpful: 90, createdAt: '2024-02-01', updatedAt: '2024-06-01', tags: ['bot builder', 'customization', 'setup'] },
    { id: 'a11', title: 'Understanding analytics and reports', category: 'Analytics', content: 'Your Analytics dashboard shows: Conversation Volume - Total chats over time. Resolution Rate - % of conversations resolved without human handoff. Average Response Time - How quickly your bot and team respond. Top Questions - Most common questions customers ask. CSAT Score - Customer satisfaction ratings. Export reports as CSV from Analytics > Export.', status: 'published', views: 678, helpful: 88, createdAt: '2024-02-20', updatedAt: '2024-06-01', tags: ['analytics', 'reports', 'metrics'] },
    { id: 'a12', title: 'Connecting WhatsApp Business', category: 'Integration', content: 'To connect WhatsApp Business: 1. Go to Integrations > WhatsApp. 2. You\'ll need a WhatsApp Business account. 3. Enter your WhatsApp Business phone number. 4. Follow the verification steps. 5. Map your bot flows to WhatsApp. Note: WhatsApp integration requires the Professional plan or higher. Message templates must be approved by WhatsApp.', status: 'draft', views: 0, helpful: 0, createdAt: '2024-06-01', updatedAt: '2024-06-01', tags: ['whatsapp', 'integration', 'messaging'] },
  ],

  botSettings: {
    name: 'Aria',
    greeting: 'Hi there! 👋 I\'m Aria, your AI assistant. How can I help you today?',
    fallback: 'I\'m not sure I understand that. Could you rephrase your question? Or I can connect you with a human agent.',
    color: '#6366f1',
    avatarEmoji: '🤖',
    suggestions: [
      'How do I reset my password?',
      'What are your pricing plans?',
      'How do I install the widget?',
      'Talk to a human agent',
    ],
    flows: [
      { id: 'f1', trigger: 'pricing', response: 'We offer three plans: Starter (Free), Professional ($49/mo), and Enterprise ($149/mo). Would you like more details about any plan?' },
      { id: 'f2', trigger: 'human|agent|talk to someone', response: 'I\'ll connect you with one of our human agents right away. Please hold on for a moment.' },
      { id: 'f3', trigger: 'refund|money back|cancel', response: 'We have a 30-day money-back guarantee. To request a refund, please create a support ticket and our billing team will assist you.' },
    ],
    offlineMessage: 'Our team is currently offline. Leave a message and we\'ll get back to you within 24 hours.',
    showPoweredBy: true,
    collectEmail: true,
    autoGreet: true,
  },

  integrations: [
    { id: 'i1', name: 'Facebook Messenger', description: 'Connect your Facebook Page to handle Messenger conversations', icon: '💬', color: '#1877f2', connected: true, config: {} },
    { id: 'i2', name: 'WhatsApp Business', description: 'Automate WhatsApp Business conversations', icon: '📱', color: '#25d366', connected: false, config: {} },
    { id: 'i3', name: 'Slack', description: 'Get notified in Slack when tickets are created or updated', icon: '🔴', color: '#4a154b', connected: true, config: {} },
    { id: 'i4', name: 'Shopify', description: 'Sync products and order data for smarter customer support', icon: '🛍️', color: '#96bf48', connected: false, config: {} },
    { id: 'i5', name: 'WordPress', description: 'Add the chat widget to your WordPress site with one click', icon: '📝', color: '#21759b', connected: true, config: {} },
    { id: 'i6', name: 'Zapier', description: 'Connect to 5,000+ apps with no-code automations', icon: '⚡', color: '#ff4a00', connected: false, config: {} },
    { id: 'i7', name: 'Email / SMTP', description: 'Handle email support alongside chat in one inbox', icon: '📧', color: '#ea4335', connected: true, config: {} },
    { id: 'i8', name: 'Stripe', description: 'View customer billing info during support conversations', icon: '💳', color: '#635bff', connected: false, config: {} },
  ],

  team: [
    { id: 'u1', name: 'Alex Johnson', email: 'admin@example.com', role: 'admin', status: 'online', avatar: 'AJ', conversations: 12, tickets: 4, joined: '2024-01-15' },
    { id: 'u2', name: 'Sarah Chen', email: 'agent@example.com', role: 'agent', status: 'online', avatar: 'SC', conversations: 28, tickets: 16, joined: '2024-02-10' },
    { id: 'u3', name: 'Marcus Rivera', email: 'owner@example.com', role: 'owner', status: 'busy', avatar: 'MR', conversations: 5, tickets: 2, joined: '2024-01-01' },
    { id: 'u4', name: 'Jessica Taylor', email: 'jessica@example.com', role: 'agent', status: 'offline', avatar: 'JT', conversations: 19, tickets: 11, joined: '2024-03-05' },
    { id: 'u5', name: 'Daniel Wang', email: 'daniel@example.com', role: 'viewer', status: 'offline', avatar: 'DW', conversations: 0, tickets: 0, joined: '2024-04-20' },
  ],

  settings: {
    company: { name: 'TechCorp Inc.', website: 'https://techcorp.io', email: 'support@techcorp.io', phone: '+1 (555) 123-4567', timezone: 'America/New_York', logo: '' },
    widget: { color: '#6366f1', position: 'bottom-right', showOnMobile: true, delay: 0 },
    businessHours: { enabled: true, timezone: 'America/New_York', hours: { mon: { open: '09:00', close: '18:00', active: true }, tue: { open: '09:00', close: '18:00', active: true }, wed: { open: '09:00', close: '18:00', active: true }, thu: { open: '09:00', close: '18:00', active: true }, fri: { open: '09:00', close: '18:00', active: true }, sat: { open: '10:00', close: '14:00', active: false }, sun: { open: '10:00', close: '14:00', active: false } } },
    autoReply: { enabled: true, message: 'Thanks for reaching out! We\'ll get back to you within 24 hours.', outsideHoursMessage: 'We\'re currently offline. Leave a message and we\'ll reply during business hours.' },
    notifications: { email: true, browser: true, newConversation: true, newTicket: true, ticketUpdate: true, mention: true },
  },

  analytics: {
    daily: [
      { date: '2024-06-01', conversations: 42, resolved: 38, avgTime: 4.2, csat: 4.6 },
      { date: '2024-06-02', conversations: 35, resolved: 31, avgTime: 3.8, csat: 4.5 },
      { date: '2024-06-03', conversations: 28, resolved: 25, avgTime: 5.1, csat: 4.3 },
      { date: '2024-06-04', conversations: 51, resolved: 46, avgTime: 3.5, csat: 4.8 },
      { date: '2024-06-05', conversations: 63, resolved: 58, avgTime: 3.2, csat: 4.7 },
      { date: '2024-06-06', conversations: 47, resolved: 42, avgTime: 4.0, csat: 4.5 },
      { date: '2024-06-07', conversations: 38, resolved: 31, avgTime: 4.5, csat: 4.6 },
    ],
    topQuestions: [
      { question: 'How do I reset my password?', count: 143 },
      { question: 'What are your pricing plans?', count: 98 },
      { question: 'How do I install the widget?', count: 87 },
      { question: 'Can I get a refund?', count: 65 },
      { question: 'How do I connect Shopify?', count: 54 },
    ],
    channels: [
      { name: 'Web Widget', count: 184, pct: 55 },
      { name: 'Messenger', count: 76, pct: 23 },
      { name: 'WhatsApp', count: 43, pct: 13 },
      { name: 'Slack', count: 30, pct: 9 },
    ],
    categories: [
      { name: 'Account', count: 89 },
      { name: 'Billing', count: 67 },
      { name: 'Technical', count: 54 },
      { name: 'General', count: 43 },
      { name: 'Integration', count: 31 },
    ]
  },

  billing: {
    plan: 'professional',
    status: 'active',
    nextBillingDate: '2024-07-07',
    amount: 49,
    card: { brand: 'Visa', last4: '4242', expiry: '09/26' },
    usage: { conversations: 1847, limit: 5000, bots: 2, botLimit: 3, agents: 5, agentLimit: 10 },
    invoices: [
      { id: 'inv-001', date: '2024-06-07', amount: 49, status: 'paid', description: 'Professional Plan - June 2024' },
      { id: 'inv-002', date: '2024-05-07', amount: 49, status: 'paid', description: 'Professional Plan - May 2024' },
      { id: 'inv-003', date: '2024-04-07', amount: 49, status: 'paid', description: 'Professional Plan - April 2024' },
      { id: 'inv-004', date: '2024-03-07', amount: 49, status: 'paid', description: 'Professional Plan - March 2024' },
    ]
  },

  notifications: [
    { id: 'n1', text: 'New conversation from Emily Watson', time: '2024-06-07T09:15:00', read: false, type: 'conversation', link: 'chat-inbox.html' },
    { id: 'n2', text: 'Ticket TKT-003 is marked urgent', time: '2024-06-07T08:00:00', read: false, type: 'ticket', link: 'tickets.html' },
    { id: 'n3', text: 'Tom Bradley started a new conversation', time: '2024-06-07T07:45:00', read: true, type: 'conversation', link: 'chat-inbox.html' },
    { id: 'n4', text: 'Monthly analytics report is ready', time: '2024-06-06T09:00:00', read: true, type: 'report', link: 'analytics.html' },
  ]
};
