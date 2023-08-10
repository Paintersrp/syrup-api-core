import { TemplateService } from './TemplateService';

export async function seedTemplates(): Promise<void> {
  const templates = [
    {
      id: 'onboarding_welcome',
      name: 'Onboarding Welcome',
      subject: 'Welcome to Our Platform',
      content: 'Welcome, {username}! Get started by exploring our features.',
      description: '',
    },
    {
      id: 'account_activation',
      name: 'Account Activation',
      subject: 'Activate Your Account',
      content: 'Activate your account by clicking {activationLink}.',
      description: '',
    },
    {
      id: 'password_reset',
      name: 'Password Reset',
      subject: 'Reset Your Password',
      content: 'Click {resetLink} to reset your password.',
      description: '',
    },
    {
      id: 'password_change_success',
      name: 'Password Change Success',
      subject: 'Password Changed Successfully',
      content: 'Your password has been changed successfully.',
      description: '',
    },
    {
      id: 'new_device_login',
      name: 'New Device Login',
      subject: 'New Device Login Detected',
      content:
        'A new login to your account was detected from {device}. If this was not you, please contact support.',
      description: '',
    },
    {
      id: 'account_suspended',
      name: 'Account Suspended',
      subject: 'Your Account Has Been Suspended',
      content: 'Your account has been suspended due to {reason}. Contact support for assistance.',
      description: '',
    },
    {
      id: 'billing_reminder',
      name: 'Billing Reminder',
      subject: 'Billing Reminder',
      content: 'Your next bill of {amount} is due on {dueDate}.',
      description: '',
    },
    {
      id: 'subscription_renewal',
      name: 'Subscription Renewal',
      subject: 'Subscription Renewal Reminder',
      content: 'Your subscription will expire on {expiryDate}. Renew now!',
      description: '',
    },
    {
      id: 'order_confirmation',
      name: 'Order Confirmation',
      subject: 'Order #{orderId} Confirmed',
      content: 'Your order #{orderId} has been confirmed and will be shipped soon.',
      description: '',
    },
    {
      id: 'order_shipped',
      name: 'Order Shipped',
      subject: 'Order #{orderId} Shipped',
      content: 'Your order #{orderId} has been shipped. Track it here: {trackingLink}',
      description: '',
    },
    {
      id: 'event_reminder',
      name: 'Event Reminder',
      subject: 'Event Reminder: {eventName}',
      content: '{eventName} is happening on {eventDate} at {location}.',
      description: '',
    },
    {
      id: 'appointment_confirmation',
      name: 'Appointment Confirmation',
      subject: 'Appointment Confirmed',
      content: 'Your appointment with {providerName} is confirmed for {appointmentDate}.',
      description: '',
    },
    {
      id: 'support_ticket_update',
      name: 'Support Ticket Update',
      subject: 'Ticket #{ticketId} Updated',
      content: 'Your support ticket #{ticketId} has been updated. {updateDetails}',
      description: '',
    },
    {
      id: 'promotion_special_offer',
      name: 'Special Offer',
      subject: 'Special Offer Just for You!',
      content: 'Enjoy {discount}% off on selected items until {expiryDate}.',
      description: '',
    },
    {
      id: 'weekly_newsletter',
      name: 'Weekly Newsletter',
      subject: "This Week's Highlights",
      content: "Check out this week's highlights and news: {newsletterLink}",
      description: '',
    },
    {
      id: 'product_update',
      name: 'Product Update',
      subject: 'New Update for {productName}',
      content: "{productName} has been updated. Check out what's new: {updateLink}",
      description: '',
    },
    {
      id: 'friend_request',
      name: 'Friend Request',
      subject: 'New Friend Request from {friendName}',
      content: '{friendName} sent you a friend request. Click here to respond: {requestLink}',
      description: '',
    },
    {
      id: 'new_follower',
      name: 'New Follower',
      subject: '{followerName} is now following you',
      content: '{followerName} started following you. Check out their profile: {profileLink}',
      description: '',
    },
    {
      id: 'comment_on_post',
      name: 'Comment on Post',
      subject: 'New Comment on Your Post',
      content: '{commenterName} commented on your post: "{commentText}"',
      description: '',
    },
    {
      id: 'invitation_to_group',
      name: 'Group Invitation',
      subject: 'Invitation to Join {groupName}',
      content:
        'You have been invited to join the group {groupName}. Click here to join: {invitationLink}',
      description: '',
    },
    {
      id: 'birthday_reminder',
      name: 'Birthday Reminder',
      subject: "{friendName}'s Birthday Reminder",
      content: "Don't forget to wish {friendName} a happy birthday on {birthdayDate}!",
      description: '',
    },
    {
      id: 'payment_received',
      name: 'Payment Received',
      subject: 'Payment Received',
      content: 'We have received your payment of {amount}. Thank you!',
      description: '',
    },
    {
      id: 'payment_failed',
      name: 'Payment Failed',
      subject: 'Payment Failed',
      content: 'Your payment of {amount} has failed. Please update your payment information.',
      description: '',
    },
    {
      id: 'survey_invitation',
      name: 'Survey Invitation',
      subject: 'We Value Your Feedback',
      content: 'Please take a moment to fill out our survey: {surveyLink}',
      description: '',
    },
    {
      id: 'gift_card',
      name: 'Gift Card',
      subject: 'You Have Received a Gift Card',
      content: 'Enjoy your gift card worth {amount} at {storeName}. Use code: {giftCode}',
      description: '',
    },
    {
      id: 'service_anniversary',
      name: 'Service Anniversary',
      subject: 'Happy {years} Year(s) with Us!',
      content: 'Thank you for being with us for {years} year(s)! We appreciate your loyalty.',
      description: '',
    },
    {
      id: 'membership_upgrade',
      name: 'Membership Upgrade',
      subject: 'Membership Upgraded',
      content: 'Congratulations! Your membership has been upgraded to {membershipLevel}.',
      description: '',
    },
    {
      id: 'security_alert',
      name: 'Security Alert',
      subject: 'Important Security Alert',
      content:
        'We have detected suspicious activity in your account. Please review your account activities.',
      description: '',
    },
    {
      id: 'feedback_request',
      name: 'Feedback Request',
      subject: 'We Need Your Feedback',
      content: 'How are we doing? Please share your feedback with us: {feedbackLink}',
      description: '',
    },
    {
      id: 'community_highlights',
      name: 'Community Highlights',
      subject: 'This Month in Our Community',
      content: "Check out what's happening in our community this month: {highlightsLink}",
      description: '',
    },
  ];

  for (const template of templates) {
    await TemplateService.createTemplate(
      template.id,
      template.name,
      template.subject,
      template.content,
      template.description
    );
  }
}
