function FeedbackDisplay({ feedback }: any) {
  return (
    <>
      <div>
        <div className="text-gray-500 italic text-sm mt-1">
          <p>Disclaimer: This is an AI-generated response.</p>
        </div>
      </div>
      <div>
        {Object.keys(feedback).length > 0 && (
          <>
            {Object.keys(feedback).map((key) => (
              <div key={key} className="mb-5">
                <h2 className="font-bold mb-1 text-sm">{key}</h2>{" "}
                {Object.entries(feedback[key]).map(([subKey, value]) => (
                  <div key={subKey} className="mb-5">
                    <h3 className="font-bold mb-0.5 text-xs">{subKey}</h3>
                    {Array.isArray(value) ? (
                      <ul className="list-disc pl-5">
                        {value.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5">
                        <li>{value}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default FeedbackDisplay;
