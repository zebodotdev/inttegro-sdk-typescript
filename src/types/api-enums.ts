/** Runtime constants for every string enum published by the Inttegro API. */

type ValueOf<T> = T[keyof T];

export const AppManagementRoles = { Parent: 'parent', Child: 'child' } as const;
export const AppCredentialOwners = { Child: 'child', Parent: 'parent' } as const;
export const AppRelationshipKinds = { Placement: 'placement' } as const;
export const AppRelationshipStatuses = {
  Active: 'active',
  Inactive: 'inactive',
  Suspended: 'suspended',
  Revoked: 'revoked',
} as const;

export const SecretKeyTokenTypes = { Bearer: 'bearer' } as const;
export const SecretKeyStatuses = {
  Active: 'active',
  Revoked: 'revoked',
  Expired: 'expired',
} as const;
export const SecretKeyAuthResults = { Succeeded: 'succeeded', Failed: 'failed' } as const;

export const FileStatuses = {
  Uploading: 'uploading',
  Processing: 'processing',
  Available: 'available',
  Failed: 'failed',
  Deleted: 'deleted',
} as const;
export const FileDispositions = { Attachment: 'attachment', Inline: 'inline' } as const;
export const FileDeliveries = { Stream: 'stream', Redirect: 'redirect' } as const;
export const FileScanStatuses = {
  Pending: 'pending',
  Passed: 'passed',
  Failed: 'failed',
  Skipped: 'skipped',
} as const;
export const FileSourceTypes = {
  Direct: 'direct',
  UploadRequest: 'upload_request',
  Service: 'service',
} as const;
export const FileStorageEncodings = { Identity: 'identity', Brotli: 'br' } as const;
export const FileLinkStatuses = {
  Active: 'active',
  Revoked: 'revoked',
  Expired: 'expired',
  Disabled: 'disabled',
} as const;
export const FileLinkKinds = { Public: 'public' } as const;
export const FileLinkDeliveryModes = {
  Redirect: 'redirect',
  Download: 'download',
  Inline: 'inline',
} as const;
export const UploadRequestStatuses = {
  Pending: 'pending',
  Uploading: 'uploading',
  Fulfilled: 'fulfilled',
  Expired: 'expired',
  Canceled: 'canceled',
  Failed: 'failed',
} as const;
export const UploadReviewDecisions = { Approved: 'approved', Rejected: 'rejected' } as const;
export const UploadReviewTypes = { Automatic: 'automatic', Manual: 'manual' } as const;

export const PaymentNextActionTypes = {
  ConfirmPayment: 'confirm_payment',
  Execute: 'execute',
  Redirect: 'redirect',
  Authorize: 'authorize',
  None: 'none',
} as const;
export const PaymentConfirmationChannels = { Sms: 'sms', Email: 'email', Push: 'push' } as const;
export const PaymentMethodTypes = {
  MobileMoney: 'mobile_money',
  BankAccount: 'bank_account',
  Card: 'card',
  Motito: 'motito',
} as const;
export const MobileMoneyNetworks = {
  Airtel: 'airtel',
  MTN: 'mtn',
  Telecel: 'telecel',
  Vodafone: 'vodafone',
} as const;

export const ProductTypes = {
  Physical: 'physical',
  Digital: 'digital',
  Service: 'service',
  Voucher: 'voucher',
  Custom: 'custom',
  Cause: 'cause',
} as const;
export const ProductShipmentTypes = {
  Delivery: 'delivery',
  Download: 'download',
  Render: 'render',
  Service: 'service',
  Stream: 'stream',
} as const;
export const ProductShipmentInputTypes = {
  Delivery: 'delivery',
  Download: 'download',
  Render: 'render',
  Stream: 'stream',
} as const;
export const LineItemTypes = { Product: 'product', Fee: 'fee', Shipping: 'shipping' } as const;

export const PurchaseIntentStatuses = {
  Active: 'active',
  Expired: 'expired',
  Inactive: 'inactive',
  Used: 'used',
} as const;
export const PurchaseIntentActivityTypes = {
  ExpiredViewed: 'expired_viewed',
  OrderCreated: 'order_created',
  PaymentFailed: 'payment_failed',
  PaymentStarted: 'payment_started',
  Viewed: 'viewed',
} as const;

export const FinancialAccountTypes = {
  Wallet: 'wallet',
  BankAccount: 'bank_account',
  DoshAccount: 'dosh_account',
} as const;
export const WalletTypes = { MobileMoney: 'mobile_money' } as const;
export const BankAccountTypes = { GhanaBankAccount: 'ghana_bank_account' } as const;

export const MessageTemplateChannels = { Sms: 'sms', Email: 'email' } as const;
export const MessageTemplateStatuses = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived',
} as const;
export const MessageTemplateVariableTypes = {
  String: 'string',
  Number: 'number',
  Integer: 'integer',
  Boolean: 'boolean',
  Url: 'url',
  Email: 'email',
  Phone: 'phone',
  Date: 'date',
  Datetime: 'datetime',
  Array: 'array',
} as const;
export const MessageTemplateVariableItemTypes = {
  String: 'string',
  Number: 'number',
  Integer: 'integer',
  Boolean: 'boolean',
  Url: 'url',
  Email: 'email',
  Phone: 'phone',
  Date: 'date',
  Datetime: 'datetime',
} as const;
export const ContentSafetyStatuses = {
  Allowed: 'allowed',
  Rejected: 'rejected',
  Quarantined: 'quarantined',
} as const;

export const OrderDocumentKinds = { Invoice: 'invoice', Receipt: 'receipt' } as const;
export const DeliveryChannels = { Email: 'email', Sms: 'sms' } as const;
export const CheckoutOrderStatuses = {
  Preparing: 'preparing',
  RequiresPayment: 'requires_payment',
  Completed: 'completed',
  Canceled: 'canceled',
  Expired: 'expired',
} as const;
export const OrderStatuses = {
  Preparing: 'preparing',
  RequiresPayment: 'requires_payment',
  Paid: 'paid',
  Completed: 'completed',
  Canceled: 'canceled',
  Expired: 'expired',
  Unknown: 'unknown',
} as const;
export const PaymentStatuses = {
  Initiated: 'initiated',
  RequiresAction: 'requires_action',
  Overdue: 'overdue',
  Executed: 'executed',
  Paid: 'paid',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export const PaymentAttemptStatuses = {
  Initiated: 'initiated',
  Executed: 'executed',
  Succeeded: 'succeeded',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export const CheckoutPaymentStatuses = {
  RequiresAction: 'requires_action',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;
export const PaymentResultStatuses = {
  Pending: 'pending',
  RequiresConfirmation: 'requires_confirmation',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;
export const OrderCreatedFromResourceTypes = { PurchaseIntent: 'purchase_intent' } as const;

export const RefundReasons = {
  RequestedByCustomer: 'requested_by_customer',
  Duplicate: 'duplicate',
  Fraudulent: 'fraudulent',
  OrderCanceled: 'order_canceled',
  ItemReturned: 'item_returned',
  ItemDamaged: 'item_damaged',
  ItemNotReceived: 'item_not_received',
  ItemNotAsDescribed: 'item_not_as_described',
  Custom: 'custom',
} as const;
export const RefundStatuses = {
  Canceled: 'canceled',
  Failed: 'failed',
  Pending: 'pending',
  Processing: 'processing',
  Succeeded: 'succeeded',
} as const;
export const BalanceTransactionTypes = { Payment: 'payment', Refund: 'refund' } as const;
export const PayoutStatuses = {
  Initialized: 'initialized',
  Scheduled: 'scheduled',
  Processing: 'processing',
  Executing: 'executing',
  Succeeded: 'succeeded',
  Invalid: 'invalid',
  Canceled: 'canceled',
} as const;

export const ChimeRecipientTypes = { Phone: 'phone', Email: 'email' } as const;
export const ChimeTransports = { Sms: 'sms', Email: 'email' } as const;
export const ChimeEmailSchemaKinds = {
  GmailViewAction: 'gmail_view_action',
  SchemaOrgOrder: 'schema_org_order',
  SchemaOrgInvoice: 'schema_org_invoice',
} as const;

export const OtpAlphabetTypes = {
  Numeric: 'numeric',
  Alpha: 'alpha',
  Alphanumeric: 'alphanumeric',
} as const;
export const OtpStatuses = {
  Canceled: 'canceled',
  Expired: 'expired',
  Pending: 'pending',
  PendingDelivery: 'pending_delivery',
  PendingVerification: 'pending_verification',
  Verified: 'verified',
} as const;
export const OtpTransmissionStatuses = {
  Delivered: 'delivered',
  Failed: 'failed',
  Submitted: 'submitted',
} as const;
export const OtpVerificationVerdicts = { Fail: 'fail', Pass: 'pass' } as const;

export type AppManagementRole = ValueOf<typeof AppManagementRoles>;
export type AppCredentialOwner = ValueOf<typeof AppCredentialOwners>;
export type AppRelationshipKind = ValueOf<typeof AppRelationshipKinds>;
export type AppRelationshipStatus = ValueOf<typeof AppRelationshipStatuses>;
export type FileStatus = ValueOf<typeof FileStatuses>;
export type FileDisposition = ValueOf<typeof FileDispositions>;
export type FileDelivery = ValueOf<typeof FileDeliveries>;
export type FileScanStatus = ValueOf<typeof FileScanStatuses>;
export type FileSourceType = ValueOf<typeof FileSourceTypes>;
export type FileStorageEncoding = ValueOf<typeof FileStorageEncodings>;
export type FileLinkStatus = ValueOf<typeof FileLinkStatuses>;
export type FileLinkKind = ValueOf<typeof FileLinkKinds>;
export type FileLinkDeliveryMode = ValueOf<typeof FileLinkDeliveryModes>;
export type UploadRequestStatus = ValueOf<typeof UploadRequestStatuses>;
export type UploadReviewDecision = ValueOf<typeof UploadReviewDecisions>;
export type UploadReviewType = ValueOf<typeof UploadReviewTypes>;
export type PaymentConfirmationChannel = ValueOf<typeof PaymentConfirmationChannels>;
export type ProductShipmentType = ValueOf<typeof ProductShipmentTypes>;
export type ProductShipmentInputType = ValueOf<typeof ProductShipmentInputTypes>;
export type MessageTemplateVariableItemType = ValueOf<typeof MessageTemplateVariableItemTypes>;
export type ContentSafetyStatus = ValueOf<typeof ContentSafetyStatuses>;
export type OrderDocumentKind = ValueOf<typeof OrderDocumentKinds>;
export type DeliveryChannel = ValueOf<typeof DeliveryChannels>;
export type CheckoutOrderStatus = ValueOf<typeof CheckoutOrderStatuses>;
export type PaymentStatus = ValueOf<typeof PaymentStatuses>;
export type PaymentAttemptStatus = ValueOf<typeof PaymentAttemptStatuses>;
export type CheckoutPaymentStatus = ValueOf<typeof CheckoutPaymentStatuses>;
export type OrderCreatedFromResourceType = ValueOf<typeof OrderCreatedFromResourceTypes>;
export type RefundReason = ValueOf<typeof RefundReasons>;
export type RefundStatus = ValueOf<typeof RefundStatuses>;
export type PayoutStatus = ValueOf<typeof PayoutStatuses>;
export type ChimeEmailSchemaKind = ValueOf<typeof ChimeEmailSchemaKinds>;
export type OTPAlphabetType = ValueOf<typeof OtpAlphabetTypes>;
export type OTPStatus = ValueOf<typeof OtpStatuses>;
export type OTPTransmissionStatus = ValueOf<typeof OtpTransmissionStatuses>;
export type OTPVerificationVerdict = ValueOf<typeof OtpVerificationVerdicts>;
