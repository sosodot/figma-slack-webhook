import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

app.get('/', async (req, res) => {
  return res.status(200).send(JSON.stringify({message: "this are not the unicorns you're looking for"}))
});

app.post('/webhook', async (req, res) => {
  const event = req.body;

  console.log(event)

  if (event.event_type === 'LIBRARY_PUBLISH') {
    const { file_key, file_name, description, timestamp, triggered_by } = event;

    const slackMessage = {
      text: `📚 *Figma Library Published*\n*File Name:* ${file_name}\n*Published by:* ${triggered_by?.handle || 'Unknown'}\n*Time:* ${new Date(timestamp).toLocaleString()}\n*Description:* ${description || 'No description'}`
    };

    try {
      await axios.post(SLACK_WEBHOOK_URL!, slackMessage);
      console.log('Posted to Slack');
    } catch (err) {
      console.error('Slack error:', err);
      return res.status(500).send(JSON.stringify({message: "unexpected error: ${err}"}))
    }
    return res.status(200).send('OK');
  } else {
    return res.status(200).send(JSON.stringify({message: "nothing to do"}))
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});