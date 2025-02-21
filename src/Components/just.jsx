import {useState, useEffect} from "react";

const App = () => {
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    if ("ai" in self && "translator" in self.ai) {
      console.log("// The Translator API is supported.");
    }
  }, []);

  // const detectLanguage = async (text) => {
  //   if (!self.ai.languageDetector || !self.ai.languageDetector.capabilities) {
  //     console.error("API is not available or API token is missing.");
  //     return "unknown";
  //   }
  //   try {
  //     const response = await self.ai.languageDetector.detect(text);
  //     return response.language || "unknown";
  //   } catch (error) {
  //     console.error("Language Detection Error:", error);
  //     return "unknown";
  //   }
  // };

  // const summarizeText = async (text, index) => {
  //   try {
  //     const response = await self.ai.summarizer.summarize(text, {});
  //     const summary = response.summary;
  //     setMessages((prevMessages) => {
  //       const updatedMessages = [...prevMessages];
  //       updatedMessages[index].summary = summary;
  //       return updatedMessages;
  //     });
  //   } catch (error) {
  //     console.error("Summarization Error:", error);
  //   }
  // };

  const translator = async () => {
    console.log(input);
    if (!("ai" in self && "translator" in self.ai)) {
      console.error("Translation API is not available.");

      return;
    }
    const translatorCapabilities = await self.ai.translator.capabilities();
    const isTranslationCapable = translatorCapabilities.languagePairAvailable(
      "en",
      "fr"
    );
    // 'readily'
    try {
      // console.log(text, selectedLang);
      // const response = await self.ai.translator.translate(text, selectedLang);
      // console.log(response);
      if (isTranslationCapable === "readily") {
        const translator = await self.ai.translator.create({
          sourceLanguage: "en",
          targetLanguage: input.value,
        });
        const translatedText = await translator.translate(input);
        console.log(translatedText);
      }
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  // const handleSend = async () => {
  //   if (!input.trim()) return alert("Please enter some text.");

  //   const newMessage = {text: input, type: "user"};
  //   setMessages((prev) => [...prev, newMessage]);
  //   const detectedLang = await input;
  //   setMessages((prev) => [
  //     ...prev,
  //     {text: input, lang: detectedLang, type: "bot"},
  //   ]);
  //   setInput("");
  // };

  return (
    <div className="flex flex-col w-full h-screen p-4 bg-black text-white">
      <div className="max-w-2xl w-full mx-auto p-4 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-white text-3xl text-center">
          Translate, Summarize and Detect <br />
          <span className="text-lg font-serif">Any Language To Another</span>
        </h1>

        <div className="flex mt-48 items-center gap-2">
          <input
            className="flex-1 p-2 border rounded-lg text-black"
            placeholder="Enter text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="p-2 bg-gray-600 text-white rounded-lg"
            onClick={translator}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
