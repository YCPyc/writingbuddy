function FeedbackDisplay({ feedback }: any) {
  return (
    <>
      <div>
        <div className="text-gray-500 italic text-sm mt-1">
          <p>
            Disclaimer: This is an AI-generated response. It may contain
            mistakes. Please check the feedback carefully.
          </p>
        </div>
      </div>
      <div>
        {Object.keys(feedback).length > 0 && (
          <>
            {Object.keys(feedback).map((key) => (
              <div key={key} className="mb-5">
                <h2 className="font-bold mb-1 text-lg">{key}</h2>

                {typeof feedback[key] === "string" ? (
                  <p className="text-base">{feedback[key]}</p>
                ) : (
                  <>
                    {Object.entries(feedback[key]).map(([subKey, value]) => (
                      <div key={subKey} className="mb-5">
                        <h3 className="font-bold mb-0.5 text-base">
                          {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
                        </h3>
                        {Array.isArray(value) ? (
                          <ul className="list-disc pl-5 text-base">
                            {value.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="list-disc pl-5 text-base">
                            <li>
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </li>
                          </ul>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default FeedbackDisplay;
