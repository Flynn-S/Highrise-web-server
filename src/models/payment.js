import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "GBP" },
  description: { type: String },
  payment_method: { type: String },
  confirm: { type: Boolean, default: false, required: true },
});

export default model("Payment", PaymentSchema);

// Payment {
//   id: 'pi_3JcCSeClTnrRJ7z40RlFJbpe',
//   object: 'payment_intent',
//   amount: 1000,
//   amount_capturable: 0,
//   amount_received: 1000,
//   application: null,
//   application_fee_amount: null,
//   canceled_at: null,
//   cancellation_reason: null,
//   capture_method: 'automatic',
//   charges: {
//     object: 'list',
//     data: [ [Object] ],
//     has_more: false,
//     total_count: 1,
//     url: '/v1/charges?payment_intent=pi_3JcCSeClTnrRJ7z40RlFJbpe'
//   },
//   client_secret: 'pi_3JcCSeClTnrRJ7z40RlFJbpe_secret_r19CaC0P9oztG7SczxYk7uJTc',
//   confirmation_method: 'automatic',
//   created: 1632244132,
//   currency: 'gbp',
//   customer: null,
//   description: null,
//   invoice: null,
//   last_payment_error: null,
//   livemode: false,
//   metadata: {},
//   next_action: null,
//   on_behalf_of: null,
//   payment_method: 'pm_1JcCSdClTnrRJ7z4s1bsZ3fG',
//   payment_method_options: {
//     card: {
//       installments: null,
//       network: null,
//       request_three_d_secure: 'automatic'
//     }
//   },
//   payment_method_types: [ 'card' ],
//   receipt_email: null,
//   review: null,
//   setup_future_usage: null,
//   shipping: null,
//   source: null,
//   statement_descriptor: null,
//   statement_descriptor_suffix: null,
//   status: 'succeeded',
//   transfer_data: null,
//   transfer_group: null
// }
