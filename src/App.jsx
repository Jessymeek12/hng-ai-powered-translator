import {useState, useEffect} from "react";

function AITextProcessing() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [targetLang, setTargetLang] = useState("en");

  useEffect(() => {
    if (!("ai" in self)) {
      console.error("Chrome AI APIs not supported.");
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {text: inputText, type: "user"};
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    detectLanguage(newMessage.text);
  };

  const detectLanguage = async (text) => {
    console.log(text);
    if (!("ai" in self && "languageDetector" in self.ai)) {
      console.error("Language Detector API not available.");
      return;
    }

    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;
    if (canDetect === "no") {
      // The language detector isn't usable.
      return;
    }
    if (canDetect === "readily") {
      // The language detector can immediately be used.
      detector = await self.ai.languageDetector.create();
    } else {
      // The language detector can be used after model download.
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
    }

    const someUserText = setDetectedLanguage;
    const results = await detector.detect(someUserText);
    for (const result of results) {
      // Show the full list of potential languages with their likelihood, ranked
      // from most likely to least likely. In practice, one would pick the top
      // language(s) that cross a high enough threshold.
      console.log(result.detectedLanguage, result.confidence);
    }
  };

  const summarizeText = async (text) => {
    if (!("ai" in self && "summarizer" in self.ai)) return;
    try {
      const summarizer = await self.ai.summarizer.create();
      const summary = await summarizer.summarize(text);
      setMessages((prev) => [...prev, {text: summary, type: "summary"}]);
    } catch (error) {
      console.error("Summarization Error:", error);
    }
  };

  const translateText = async (text) => {
    console.log(text);
    if (!("ai" in self && "translator" in self.ai)) return;

    const translatorCapabilities = await self.ai.translator.capabilities();
    const isTranslationCapable = translatorCapabilities.languagePairAvailable(
      "en",
      "fr",
      "pt",
      "ru",
      "tr",
      "es"
    );
    try {
      if (isTranslationCapable === "readily") {
        const translator = await self.ai.translator.create({
          sourceLanguage: "en",
          targetLanguage: targetLang,
        });
        const translatedText = await translator.translate();
        console.log(translatedText);
      }
      const translator = await self.ai.translator.create({
        sourceLanguage: detectedLanguage || "en",
        targetLanguage: targetLang,
      });
      const translated = await translator.translate(text);
      setMessages((prev) => [...prev, {text: translated, type: "translation"}]);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:px-64 p-4 bg-black">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-700 shadow rounded-lg">
        <h1 className="text-center text-white text-3xl">
          Translate, Summarize and Detect
          <br />
          <span className=" text-sm font-serif">
            From one language to another
          </span>
        </h1>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              msg.type === "user" ? "bg-gray-500" : "bg-gray-500"
            }`}
          >
            {msg.text}
            {msg.type === "user" && msg.text.length > 150 && (
              <button
                className="ml-2 text-gray-600"
                onClick={() => summarizeText(msg.text)}
              >
                Summarize
              </button>
            )}
            {msg.type === "user" && (
              <div className="mt-1">
                <select
                  className="p-1 border rounded"
                  onChange={(e) => setTargetLang(e.target.value)}
                  value={targetLang}
                >
                  <option value="en">English</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                  <option value="fr">French</option>
                </select>
                <button
                  className="ml-2 text-green-500"
                  onClick={() => translateText(msg.text)}
                >
                  Translate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex p-2 border-t bg-white rounded-md">
        <textarea
          className="flex-1 p-2  rounded"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 p-2 bg-gray-600 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AITextProcessing;
