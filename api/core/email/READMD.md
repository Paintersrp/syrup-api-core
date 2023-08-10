# SMTPClient Module

## Table of Contents

<ol>
  <li><a href="#overview">Overview</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#methods">Methods</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ol>

<h2 id="overview">Overview</h2>
<p>The <code>SMTPClient</code> class provides a concise and efficient way to handle email operations with an SMTP server. It allows you to send emails, verify the SMTP connection, and supports retrying failed send attempts.</p>

<h2 id="installation">Installation</h2>
<p>You can install the <code>SMTPClient</code> module into your project by cloning the repository or downloading the module.</p>

<pre>
git clone &lt;repository-url&gt;
</pre>

<p>Make sure to install the required dependencies:</p>

<pre>
npm install nodemailer
</pre>

<h2 id="usage">Usage</h2>
<p>Import the <code>SMTPClient</code> class into your code and initialize it with the SMTP server configuration.</p>

```typescript
import { SMTPClient } from './path/to/SMTPClient';

const smtpConfig = {
  host: 'smtp.example.com',
  port: 587,
  user: 'username@example.com',
  pass: 'password',
};

const client = new SMTPClient(smtpConfig);
await client.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello',
  body: 'Welcome to SMTPClient!',
});
```

<h2 id="methods">Methods</h2>
<ul>
  <li><strong>constructor(smtpConfig: SMTPConfig)</strong>: Initializes the SMTPClient with the given SMTP configuration.</li>
  <li><strong>checkConnection(): Promise&lt;void&gt;</strong>: Verifies the SMTP connection.</li>
  <li><strong>sendEmail(options: EmailOptions): Promise&lt;void&gt;</strong>: Sends an email with the given options, including retries.</li>
</ul>

<h2 id="contributing">Contributing</h2>
<p>Contributions to the <code>SMTPClient</code> module are welcome. Please submit a pull request or open an issue to discuss proposed changes.</p>

<h2 id="license">License</h2>
<p><a href="LICENSE">MIT License</a></p>

---
