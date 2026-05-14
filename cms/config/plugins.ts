module.exports = ({ env }) => ({
  // Plugin de upload (local em dev, S3 em produção)
  upload: {
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      // Para S3 em produção:
      // provider: 'aws-s3',
      // providerOptions: {
      //   s3Options: {
      //     credentials: {
      //       accessKeyId: env('AWS_ACCESS_KEY_ID'),
      //       secretAccessKey: env('AWS_ACCESS_SECRET'),
      //     },
      //     region: env('AWS_REGION'),
      //     params: { Bucket: env('AWS_BUCKET') },
      //   },
      // },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // Email (para notificações de inscrição)
  /*email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@aisaph-cv.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'info@aisaph-cv.com'),
      },
    },
  },*/
})