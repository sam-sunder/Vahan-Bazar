const QualityBadge = ({ label, isActive = false }) => {
  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {isActive && (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </div>
  );
};

export default QualityBadge;