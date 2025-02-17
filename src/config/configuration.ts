import { send } from 'process';

export default () => ({
  safe2pay: {
    IsSandbox: process.env.SAFE2PAY_MODE === 'sandbox',
    CallbackUrl: ``,
    Address: {
      ZipCode: '90670090',
      Street: 'Logradouro',
      Number: '123',
      Complement: 'Complemento',
      District: 'Higienopolis',
      CityNam: 'Porto Alegre',
      StateInitials: 'RS',
      CountryName: 'Brasil',
    },
  },
  inter_pj_banking: {
    IsSandbox: process.env.INTER_PJ_BANKING_MODE === 'sandbox',
    CallbackUrl: ``,
    PixKey: process.env.INTER_PJ_BANKING_PIX_KEY || '39510678000150',
    client_id:
      process.env.INTER_PJ_BANKING_CLIENT_ID ||
      'd1e10e35-a14c-4631-b3c3-c2627a2109f7',
    client_secret:
      process.env.INTER_PJ_BANKING_CLIENT_SECRET ||
      'd58fec05-42ec-41e5-9a3d-740007e58cc6',
  },
  mercado_pago: {
    is_sandbox: false,
    callback_url:
      process.env.MERCADO_PAGO_CALLBACK_URL ||
      `https://api.limopay.com.br/ipn/mercadopago`,
    public_key:
      process.env.MERCADO_PAGO_PUBLIC_KEY ||
      'APP_USR-7275b8ed-caff-4c4b-80e1-5edbe590f60a',
    access_token:
      process.env.MERCADO_PAGO_ACCESS_TOKEN ||
      'APP_USR-2730120430316758-061317-706b5b0d00d93003f5297394402dc462-1856368006',
  },
  pagstar: {
    is_sandbox: process.env.PAGSTAR_MODE === 'sandbox',
    callback_url: ``,
    tenant_id:
      process.env.PAGSTAR_TENANT_ID || '9a5e502d-b7f0-47d1-8aa5-35c0c2a8484a',
    access_key: process.env.PAGSTAR_ACCESS_KEY || 'QAZw1lmlhMi76AOj',
    client_email:
      process.env.PAGSTAR_CLIENT_EMAIL || 'guilhermeggffaria@gmail.com',
  },
  suitpay: {
    is_sandbox: process.env.SUITPAY_MODE === 'sandbox',
    callback_url: ``,
    token:
      process.env.SUITPAY || '586|dlfQdtRbRMzl0MSknFyzhlkNstyTxRWRKKAKjZKZ',
    client_id: process.env.SUITPAY_CLIENT_ID || 'sunize_1709580648166',
    client_secret:
      process.env.SUITPAY_CLIENT_SECRET ||
      '2d7fcec137ddaf8422aabe2c6d7738224f5430c7516fc9a17fb267c25c4958f0df87276bc7254a9681578cd4363cf416',
  },
  frontend_url: process.env.FRONTEND_URL || 'https://painel.projectxpayment.com',
  members_url: process.env.MEMBERS_URL || 'https://members.projectxpayment.com',
  content_url: process.env.CONTENT_URL || 'https://conteudo.projectxpayment.com',

  mailer: {
    default_address: 'naoresponda@projectxpayment.com',
    default_name: 'projectx',
  },
  google: {
    API_KEY:
      process.env.GOOGLE_API_KEY || 'AIzaSyBopzwGTYshvPyUbhjEumXxJyYZhV8COK0',
  },
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-2xs',
  AWS_BUCKET: process.env.AWS_BUCKET || 'limopay-s3',
  CDN_URL:
    process.env.CDN_URL || 'https://limopay-s3.s3.us-east-2.amazonaws.com/',
  SENTRY_DSN: process.env.SENTRY_DSN,
  ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  twilio: {
    accountSid:
      process.env.TWILIO_ACCOUNT_SID || 'ACcb13b7944e05e2afece0045f96c2640d',
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifyServiceSid:
      process.env.TWILIO_VERIFY_SERVICE_SID ||
      'VA66cc1bb75c4fd36c1dbab4859214ea89',
  },
  openpix: {
    cliend_id:
      process.env.OPENPIX_CLIENT_ID ||
      'Client_Id_b254e030-fa6b-42ad-98d5-9da55f603d4b',
    app_id:
      process.env.OPENPIX_APP_ID ||
      'Q2xpZW50X0lkX2IyNTRlMDMwLWZhNmItNDJhZC05OGQ1LTlkYTU1ZjYwM2Q0YjpDbGllbnRfU2VjcmV0XzRwZ0Eyb3VnK2laSXRtaVh4VlJ2NnlINkl4dW1sWGwwc1o3SVV1SXNjbTg9',
    callback_url: `https://api.sunize.com.br/ipn/openpix`,
    ipn_secret:
      '3Q0ttR8csesH9eKeChRDDyQoirHR1F8Q9g6B8Irzw8QTFZcFIXpdMa33XrglZ7H',
  },
  saqpay: {
    callback_url: `https://api.sunize.com.br/ipn/pagstar`,

    authorization:
      'Basic Yjk3MzlkMjEtZDM3My00MjFkLTlmNTgtYWE3NDVmNDkzZTIwOlRucG49cUI3VEUxKWVxbzZ6M3l0K252XilmVVVLJEt6',
    ipn_secret: 'b9739d21-d373-421d-9f58-aa745f493e20',
  },
  paggueio: {
    client_key: '2925568543099123083040',
    client_secret: '96550567974888023215667',
    company_id: 154230,
    ipn_secret: 'J9IKA76AS5AS76AS7HYSAD67ASD7GSAD',
  },
  starpay: {
    client_id: 'sunize_1713238960924',
    client_secret:
      'a5d05a8df9d6e9aa1bb047bd6a1a4d48deacab533c632412291b2ce31fcecdd718edc41b859d4a559e11dab1939acb4e',
    ipn_secret:
      'Rc9JCGkL21dsgEqWfZjIzdOlDeTgyGx2a6azR4eTa6Jlt9iC3Kblb2wZL7wmrDMt',
    callback_url: `https://api.sunize.com.br/ipn/starpay?ipn_secret=Rc9JCGkL21dsgEqWfZjIzdOlDeTgyGx2a6azR4eTa6Jlt9iC3Kblb2wZL7wmrDMt`,
  },
  cielo: {
    merchant_id: 'e81f3272-86ff-4327-9946-68a58370415c',
    merchant_key: 'rzaHgw265gTIVCtE6uqndoKDNJcQFM50qOZlf91K',
    sandbox: process.env.CIELO_SANDBOX === 'true',
    callback_url: `https://api.sunize.com.br/ipn/cielo`,
  },
  vimeo: {
    client_id: '3911559bcbe3db37f9056746300321ec58294f5b',
    client_secret:
      'wW79K0kiebRicvSN5gE8Io/UiTNCGL6iwoGy2iyp3RgyxqKvn3Q9svK6GrD7wytbGI9Wc+GLA3cCvRXh3X95r0YOU+/JvVMInN9Ufd2S/PEU6ZlFqD9SSKNOByawvXiM',
    access_token: '452a041b7421345aeb3bdab90aa63cc0',
  },
  firebanking: {
    api_key: 'f68ed037-b8ab-4a30-8717-55da16dd6eb5',
  },
  sendgrid: {
    api_key: process.env.MAIL_SEND_GRID_API_KEY,
  },
  celcoin: {
    galax_id: '49275',
    galax_hash: 'O8994pIsE3AeLaSq60I8N3Av5lD8UqHs5808Pi0p',
  },
});
