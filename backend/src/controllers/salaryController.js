const calculateSalary = (req, res) => {
  try {
    const { ctc } = req.body;

    if (!ctc || ctc <= 0) {
      return res.status(400).json({ message: 'Please provide a valid CTC' });
    }

    const annual = parseFloat(ctc);

    // Basic salary is typically 40-50% of CTC
    const basicSalary = annual * 0.40;

    // HRA is typically 40% of basic (non-metro) or 50% (metro)
    const hra = basicSalary * 0.40;

    // PF contribution (12% of basic, capped at 1800/month)
    const pfMonthly = Math.min(basicSalary / 12 * 0.12, 1800);
    const pfAnnual = pfMonthly * 12;

    // Special allowance = CTC - basic - HRA - PF (employer) - other benefits
    const specialAllowance = annual - basicSalary - hra - pfAnnual;

    // Gross salary (before tax)
    const grossSalary = basicSalary + hra + specialAllowance;

    // Income tax calculation (New Tax Regime 2024-25)
    let incomeTax = 0;
    const taxableIncome = grossSalary - pfAnnual - 75000; // standard deduction

    if (taxableIncome <= 300000) {
      incomeTax = 0;
    } else if (taxableIncome <= 700000) {
      incomeTax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      incomeTax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      incomeTax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      incomeTax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      incomeTax = 140000 + (taxableIncome - 1500000) * 0.30;
    }

    // Health & Education Cess (4% of income tax)
    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;

    // In-hand salary
    const annualInHand = grossSalary - totalTax - pfAnnual;
    const monthlyInHand = annualInHand / 12;

    res.json({
      ctc: annual,
      breakdown: {
        basicSalary: Math.round(basicSalary),
        hra: Math.round(hra),
        specialAllowance: Math.round(specialAllowance),
        providentFund: Math.round(pfAnnual),
        grossSalary: Math.round(grossSalary),
        incomeTax: Math.round(totalTax),
        annualInHand: Math.round(annualInHand),
        monthlyInHand: Math.round(monthlyInHand),
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { calculateSalary };