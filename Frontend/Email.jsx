import { useState } from 'react';
import axios from 'axios';

const Email = () => {
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/send-email', {
        email,
        content
      });
      setSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      <h2>Contact Form</h2>
      {sent ? (
        <p>Email sent successfully!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Your Email:</label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} required />
          </div>
          <div>
            <label htmlFor="content">Message:</label>
            <textarea id="content" value={content} onChange={handleContentChange} required />
          </div>
          <button type="submit">Send Email</button>
        </form>
      )}
    </div>
  );
};

export default Email;
