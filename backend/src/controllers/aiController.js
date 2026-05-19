const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getFinancialAdvice = async (req, res) => {
  try {
    const { ctc, breakdown } = req.body;

    if (!ctc || !breakdown) {
      return res.status(400).json({ message: 'Please provide CTC and breakdown data' });
    }

    const prompt = `
You are a personal financial advisor for a fresher in India who just received their first job offer.

Their salary details:
- CTC (Cost to Company): ₹${ctc.toLocaleString('en-IN')}
- Monthly In-Hand Salary: ₹${breakdown.monthlyInHand.toLocaleString('en-IN')}
- Annual In-Hand Salary: ₹${breakdown.annualInHand.toLocaleString('en-IN')}
- Income Tax: ₹${breakdown.incomeTax.toLocaleString('en-IN')} per year
- Provident Fund: ₹${breakdown.providentFund.toLocaleString('en-IN')} per year

Give them a practical, simple and friendly financial plan. Include:
1. Emergency Fund - how much to save and where
2. Tax Saving Investments - specific amounts for PPF, ELSS, NPS
3. Monthly Budget Split - rent, food, transport, savings, lifestyle
4. First year financial goals

Keep it concise, use bullet points, and give specific rupee amounts. 
Speak directly to the person. Be encouraging and realistic.
Do not use markdown headers with ##. Use simple numbered sections.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const advice = result.response.text();

    res.json({ advice });

  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

module.exports = { getFinancialAdvice };