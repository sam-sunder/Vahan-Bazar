const BenefitCard = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm text-gray-600 text-center">{title}</p>
    </div>
  );
};

export default BenefitCard;