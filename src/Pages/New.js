import React from 'react'

function New() {
    const [chatMessages, setChatMessages] = useState([]); // Array of all chat messages (prompt + response)
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [chatMessages]);

    const submitPrompt = () => {
        const promptInput = document.getElementById('prompt'); // Get the input element
        const promptValue = promptInput.value;
      
        if (!promptValue) {
          Swal.fire({
            title: "Error",
            text: "Please give proper prompt!",
            icon: "error",
          });
          return;
        }
      
        
      
        setCompletion('<iframe src="https://giphy.com/embed/ycfHiJV6WZnQDFjSWH" width="480" height="480" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/waiting-loading-load-ycfHiJV6WZnQDFjSWH">via GIPHY</a></p>'); // Set loading state
        setIsSubmitting(true); // Disable the button and Enter key
      
        fetch(`${BASE_URL}/submitPrompt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: promptValue, user: 'user' }),
        })
          .then((response) => response.json())
          .then((data) => {
            const responseContent = convertString(data.completion);
      
            // Add the response to the chatMessages
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { content: responseContent, type: 'response' },
            ]);
            setCompletion(responseContent);
            promptInput.value = ''; // Clear the input field
          })
          .catch((error) => {
            console.error('Error:', error);
            
          })
          .finally(() => {
            setIsSubmitting(false); // Re-enable the button and Enter key
          });
      };

      

      const renderChatMessages = () => {
        return chatMessages.map((message, index) => {
          const isPrompt = message.type === 'prompt';
          const isResponse = message.type === 'response';
      
          return (
            <tr
              key={index}
              className={`max-w-[60%] ${isPrompt ? 'self-end' : 'self-start'}`}
            >
              <td
                className={`relative xl:p-4 xl:py-3 2xl:p-4 mt-4 mb-4 rounded-[20px] xl:text-lg 2xl:text-xl ${
                  isPrompt
                    ? 'bg-black text-slate-300'
                    : 'bg-slate-300 text-[#212121]'
                } shadow-[0px_54px_20px_rgba(0,0,0,0.3)]`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: message.content.replace(/\n/g, '<br>'),
                  }}
                />
              </td>
            </tr>
          );
        });
      };
      
  return (
    <>
    <div className="chat-container">
  <table className="chat-table">
    <tbody>{renderChatMessages()}</tbody>
  </table>
</div>


<div className="chat-container" ref={chatContainerRef}>
  <table className="chat-table">
    <tbody>{renderChatMessages()}</tbody>
  </table>
</div>

</>
  )
}

export default New