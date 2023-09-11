export enum TemplateType {
  WelcomeEmail,
  PasswordReset,
  AccountActivation,
  OrderConfirmation,
  ShippingUpdate,
  InvoiceReceipt,
  EventInvitation,
  FeedbackRequest,
  SubscriptionRenewal,
  AccountDeactivation,
  SupportTicket,
}

interface WelcomeEmailParams {
  name: string;
}
interface PasswordResetParams {
  resetLink: string;
}

interface AccountActivationParams {
  activationLink: string;
}
interface OrderConfirmationParams {
  orderId: string;
  totalPrice: string;
}
interface ShippingUpdateParams {
  trackingNumber: string;
}
interface InvoiceReceiptParams {
  invoiceNumber: string;
  totalAmount: string;
}
interface EventInvitationParams {
  eventName: string;
  eventDate: string;
}
interface FeedbackRequestParams {
  feedbackLink: string;
}
interface SubscriptionRenewalParams {
  renewalDate: string;
}
interface AccountDeactivationParams {
  reactivationLink: string;
}
interface SupportTicketParams {
  ticketNumber: string;
  supportLink: string;
}

interface Template<P> {
  subject: string;
  content: string;
  params: P;
}

export type TemplateMapping = {
  [TemplateType.WelcomeEmail]: Template<WelcomeEmailParams>;
  [TemplateType.PasswordReset]: Template<PasswordResetParams>;
  [TemplateType.AccountActivation]: Template<AccountActivationParams>;
  [TemplateType.OrderConfirmation]: Template<OrderConfirmationParams>;
  [TemplateType.ShippingUpdate]: Template<ShippingUpdateParams>;
  [TemplateType.InvoiceReceipt]: Template<InvoiceReceiptParams>;
  [TemplateType.EventInvitation]: Template<EventInvitationParams>;
  [TemplateType.FeedbackRequest]: Template<FeedbackRequestParams>;
  [TemplateType.SubscriptionRenewal]: Template<SubscriptionRenewalParams>;
  [TemplateType.AccountDeactivation]: Template<AccountDeactivationParams>;
  [TemplateType.SupportTicket]: Template<SupportTicketParams>;
};

export const TEMPLATES: TemplateMapping = {
  [TemplateType.WelcomeEmail]: {
    subject: 'Welcome, {name}!',
    content: 'Hello {name}, welcome to our service!',
    params: {} as WelcomeEmailParams,
  },
  [TemplateType.PasswordReset]: {
    subject: 'Reset Your Password',
    content: 'Click {resetLink} to reset your password.',
    params: {} as PasswordResetParams,
  },
  [TemplateType.AccountActivation]: {
    subject: 'Activate Your Account',
    content: 'Click {activationLink} to activate your account.',
    params: {} as AccountActivationParams,
  },
  [TemplateType.OrderConfirmation]: {
    subject: 'Order Confirmation: #{orderId}',
    content: 'Your order #{orderId} has been confirmed. Total price: {totalPrice}.',
    params: {} as OrderConfirmationParams,
  },
  [TemplateType.ShippingUpdate]: {
    subject: 'Shipping Update',
    content: 'Your order has been shipped. Tracking number: {trackingNumber}.',
    params: {} as ShippingUpdateParams,
  },
  [TemplateType.InvoiceReceipt]: {
    subject: 'Invoice #{invoiceNumber}',
    content: 'Here is your invoice #{invoiceNumber}. Total amount: {totalAmount}.',
    params: {} as InvoiceReceiptParams,
  },
  [TemplateType.EventInvitation]: {
    subject: 'Invitation to {eventName}',
    content: 'You are invited to {eventName} on {eventDate}.',
    params: {} as EventInvitationParams,
  },
  [TemplateType.FeedbackRequest]: {
    subject: 'We Value Your Feedback',
    content: 'Please provide your feedback by clicking {feedbackLink}.',
    params: {} as FeedbackRequestParams,
  },
  [TemplateType.SubscriptionRenewal]: {
    subject: 'Subscription Renewal Notice',
    content: 'Your subscription will renew on {renewalDate}.',
    params: {} as SubscriptionRenewalParams,
  },
  [TemplateType.AccountDeactivation]: {
    subject: 'Account Deactivated',
    content: 'Your account has been deactivated. Reactivate by clicking {reactivationLink}.',
    params: {} as AccountDeactivationParams,
  },
  [TemplateType.SupportTicket]: {
    subject: 'Support Ticket #{ticketNumber}',
    content:
      'Your support ticket #{ticketNumber} has been created. Visit {supportLink} for updates.',
    params: {} as SupportTicketParams,
  },
};
