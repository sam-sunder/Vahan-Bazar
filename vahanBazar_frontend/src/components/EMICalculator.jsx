import { useState, useEffect } from 'react';

const EMICalculator = ({ vehiclePrice, onClose }) => {
  const [loanAmount, setLoanAmount] = useState(vehiclePrice * 0.8); // 80% of vehicle price
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(36);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfPayments = tenure;

    const emiAmount = 
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfPayments)) /
      (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);

    const totalAmount = emiAmount * numberOfPayments;
    const interestPaid = totalAmount - principal;

    setEmi(Math.round(emiAmount));
    setTotalPayment(Math.round(totalAmount));
    setTotalInterest(Math.round(interestPaid));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">EMI Calculator</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid gap-6 mb-8">
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">Loan Amount</label>
                <span className="text-sm font-medium">₹{loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={vehiclePrice * 0.2}
                max={vehiclePrice}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹{(vehiclePrice * 0.2).toLocaleString()}</span>
                <span>₹{vehiclePrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">Interest Rate</label>
                <span className="text-sm font-medium">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={8}
                max={16}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8%</span>
                <span>16%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">Tenure (months)</label>
                <span className="text-sm font-medium">{tenure} months</span>
              </div>
              <input
                type="range"
                min={12}
                max={84}
                step={12}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>7 years</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-xl p-6 grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                <p className="text-xl font-bold text-primary">₹{emi.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-orange-600">₹{totalInterest.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Payment</p>
                <p className="text-xl font-bold">₹{totalPayment.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Apply for Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;