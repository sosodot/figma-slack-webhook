import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

app.post('/', async (req, res) => {
  const event = req.body;

  if (event.event_type === 'LIBRARY_PUBLISH') {
    const { file_key, file_name, description, created_at, created_by } = event;

    const slackMessage = {
      text: `📚 *Figma Library Published*\n*File Name:* ${file_name}\n*Published by:* ${created_by?.name || 'Unknown'}\n*Time:* ${new Date(created_at).toLocaleString()}\n*Description:* ${description || 'No description'}`
    };

    try {
      await axios.post(SLACK_WEBHOOK_URL!, slackMessage);
      console.log('Posted to Slack');
    } catch (err) {
      console.error('Slack error:', err);
    }
  }

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});