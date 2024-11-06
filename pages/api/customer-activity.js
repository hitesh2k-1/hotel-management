import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'customerActivity.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // basic insights for most and least active areas
      const mostActiveArea = data.reduce((max, entry) => (entry.activity > max.activity ? entry : max), data[0]);
      const leastActiveArea = data.reduce((min, entry) => (entry.activity < min.activity ? entry : min), data[0]);

      // peak activity time across all data
      const peakActivityTime = data.reduce((max, entry) => (entry.activity > max.activity ? entry : max), data[0]);

      const insights = {
        mostActiveArea,
        leastActiveArea,
        peakActivityTime: {
          time: peakActivityTime.time,
          area: peakActivityTime.area,
          activity: peakActivityTime.activity
        }
      };

      res.status(200).json({ data, insights });
    } catch (error) {
      res.status(500).json({ message: 'Error reading data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
