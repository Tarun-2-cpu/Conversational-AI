import React, { useState, useEffect, useRef } from 'react'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
} from 'reactstrap';
import './home.css'

const BASE_URL = "https://tarun.whatzz.app";

    // http://localhost:8999
    //https://tarun.whatzz.app

    //when any chat is clicked the file name is set to the chat name


    function Home() {


    const [tableData, setTableData] = useState([]);
    const [storedLinks, setStoredLinks] = useState([]);
    const [prompt, setPrompt] = useState(''); // Prompt value
    const [completion, setCompletion] = useState('');
    const [system, setSystem] = useState('');  // Holds system data
    const [saveStatus, setSaveStatus] = useState('');  // Save status
    const [suffix, setSuffix] = useState('');
    const lastRowRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const [dropdown2Open, setDropdown2Open] = useState(false);

    const toggle2 = () => setDropdown2Open(!dropdown2Open);

    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);

    


    useEffect(() => {
        updateTable();
        updateStored();

      const input = document.getElementById("prompt");
      const button = document.getElementById("submit_prompt");

      // Add event listener for Enter key
      const handleEnterKey = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          button.click();
        }
      };

      input.addEventListener("keydown", handleEnterKey);

      return () => {
        input.removeEventListener("keydown", handleEnterKey);
      };


    }, [completion]);

    const updateTable = () => {
      fetch(`${BASE_URL}/getAll`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          
          const formattedData = data.data.map((item, index) => {
            // Determine if the current index is left or right aligned
            const isLeft = index === 0 || index % 2 === 1; // First, second, fourth, etc. are on the left
    
            // Assign design based on the index
            const isPrimaryDesign = index === 0 || index % 2 === 0; // 1st, 2nd, 4th have the same design
    
            if (index === 0) {
              setSystem(item.content);
              console.log(item.content);
            }
    
            // Add a ref to the last row
            const isLastRow = index === data.data.length - 1;
    
            return (
              <tr
                key={index}
                ref={isLastRow ? lastRowRef : null} // Set the ref on the last row
                className={`max-w-[60%] ${isLeft ? 'self-end' : 'self-start'}`}  // Alternates alignment
              >
                <td
                  className={`p-4 mt-4 mb-4 rounded-[20px] text-xl ${
                    isPrimaryDesign
                      ? 'bg-slate-300 text-[#212121]  shadow-md shadow-black'  // Design for 1st, 2nd, 4th
                      : 'bg-black text-slate-300  shadow-md shadow-slate-300' // Design for 3rd, 5th, 7th
                  } ${isLeft ? 'text-left italic'  : 'text-left font-semibold'}`}
                  dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br>') }}
                />
              </tr>
            );
          });
    
          setTableData(formattedData);
    
          // Scroll to the last row after the table is updated
          setTimeout(() => {
            if (lastRowRef.current) {
              lastRowRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0); // Small delay to ensure DOM updates
        });
    };
    
    



      /******************************************************************************************** */


      
      const toggleDropdown = (index) => {
        setDropdownOpen((prevState) =>
          prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
      };
      
      const updateStored = () => {
        fetch(`${BASE_URL}/getStored`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data.dir);
      
            const links = data.dir.map((folder, index) => (
              <div
                key={index}
                className="h-fit flex items-center justify-between py-2 px-3 mt-3 cursor-pointer hover:bg-slate-600 rounded-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-slate-300 text-xl font-semibold">{folder}</p>
                </div>
      
                {/* Button with quill icon that triggers submitStored on click */}
                <button
                  className="text-zinc-200 bg-transparent border-none w-fit text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                  onClick={() => submitStored(folder)} // Calls submitStored on click
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                  type="button"
                  value="RESTORE"
                >
                  <i className="ri-quill-pen-line text-slate-300 text-xl hover:text-3xl"></i>
                </button>
              </div>
            ));
      
            setStoredLinks(links);
          });
      };
      
      function submitStored(folder) {
        // Handle state instead of direct DOM manipulation
        // setSuffix(folder);
        restore(folder);
        
        fetch(`${BASE_URL}/getSystem`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data.system);
            setSystem(data.system);  // Updates the system textarea
          });
      }




/*********************************************************8 */


    //   const updateStored = () => {
    //     fetch(`${BASE_URL}/getStored`)
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data.dir);
    //         const links = data.dir.map((folder, index) => (
    //           <a key={index} href="#" onClick={() => submitStored(folder)}>
    //             {folder}
    //           </a>
    //         ));
    //         setStoredLinks(links);
    //       });
    //   };


    // /*

    function resetAll() {
      fetch(`${BASE_URL}/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.status);
          document.getElementById('save_status').innerHTML = `Upload Status ${data.status}`;
          updateTable();
        });
    }

    function restore(suffix) {
      console.log(suffix);
    
      if (checkSuffix(suffix)) return;

      setSuffix(suffix);
      
      fetch(`${BASE_URL}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suffix }),
      }).then(() => {
        const date = new Date();
        setSaveStatus('Restored - ' + date.toLocaleTimeString());  // Update the save status
        updateTable();
      });
    }



    const saveSystem = () => {
      resetAll();
      submitSystem();
      save(suffix);
      restore(suffix);
    };

    

      


/*************************** */      

    // function restore() {
    //     const suffix = document.getElementById('suffix').value;
    //     console.log(suffix);
      
    //     if (checkSuffix(suffix)) return;
      
    //     fetch(`${BASE_URL}/restore`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ suffix }),
    //     }).then(() => {
    //       const date = new Date();
    //       document.getElementById('save_status').innerHTML = 'Restored - ' + date.toLocaleTimeString();
    //       updateTable();
    //     });
    //   }
      
      /********************************* */


      function refresh() {
        updateTable();
      }
        
      function checkSuffix(suffix) {
        if (!suffix) {
          alert('Need Proper Suffix / Fine-Tune Name to proceed');
          return true;
        }
        return false;
      }
      

const save = () => {
  if (checkSuffix(suffix)) return;

  fetch(`${BASE_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ suffix }), // No need to use getElementById anymore
  }).then(() => {
    const date = new Date();
    setSaveStatus(`Saved - ${date.toLocaleTimeString()}`);
  });
};


      

    const toggle3 = () => setModal(!modal);
    const changeUnmountOnClose = (e) => {
        let { value } = e.target;
    };

    const toggle4 = () => setModal2(!modal2);
    const changeUnmountOnClose2 = (e) => {
        let { value } = e.target;
    };

    

      function submitSystem() {

        fetch(`${BASE_URL}/submitSystem`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ system }),
        }).then((data) => {
          console.log(data.status);
          updateTable();
        });
      }

      const submitPrompt = () => {
        const promptInput = document.getElementById('prompt'); // Get the input element
        const promptValue = promptInput.value;
        console.log(promptValue);
        setCompletion('<iframe src="https://giphy.com/embed/ycfHiJV6WZnQDFjSWH" width="480" height="480" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/waiting-loading-load-ycfHiJV6WZnQDFjSWH">via GIPHY</a></p>'); // Set loading state
      
        fetch(`${BASE_URL}/submitPrompt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: promptValue, user: 'user' }), // Adjust this if you add user selection
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Completion:', data.completion);
            setCompletion(convertString(data.completion)); // Update the completion text
            promptInput.value = ""; 
            updateTable(); // Update table or other UI elements
          })
          .catch((error) => {
            console.error('Error:', error);
            setCompletion('Error processing the request.');
          });
      };


/********************************* */
  //   const submitPrompt = () => {
  //   const promptValue = document.getElementById('prompt').value; // Get value from the existing input
  //   setCompletion('<img src="loading.gif" alt="loading"/>'); // Set loading state

  //   fetch(`${BASE_URL}/submitPrompt`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ prompt: promptValue, user: 'user' }), // Adjust this if you add user selection
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Completion:', data.completion);
  //       setCompletion(convertString(data.completion)); // Update the completion text
  //       updateTable(); // Update table or other UI elements
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //       setCompletion('Error processing the request.');
  //     });
  // };

/******************************** */
      function convertString(originalString) {
        return originalString.replace(/\n/g, "<br>");
      }

      function convert() {
        const suffix = document.getElementById('suffix').value;
        console.log(suffix);

        if (checkSuffix(suffix)) return;
      
        fetch(`${BASE_URL}/convert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ suffix }),
        })
          .then(response => response.json())
          .then(() => {
            const date = new Date();
            document.getElementById('save_status').innerHTML = 'Convert Done - ' + date.toLocaleTimeString();
            updateTable();
          });
      }


      function upload() {
        const suffix = document.getElementById('suffix').value;
      
        if (checkSuffix(suffix)) return;
      
        fetch(`${BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ suffix }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.status);
            console.log(data.file_id);
            document.getElementById('save_status').innerHTML = `Upload Status ${data.status} - FileID: ${data.file_id}`;
          });
      }
      
      


    return (
        <div className=" h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="w-1/5 bg-zinc-900 h-screen overflow-y-auto no-scrollbar">
                <div className="h-fit flex items-center justify-between py-4 px-3">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-xl-heavy text-slate-300 hover:h-9 hover:w-9 cursor-pointer"><path fillRule="evenodd" clipRule="evenodd" d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z" fill="currentColor"></path></svg>

                    <button className="flex w-fit gap-2 items-center cursor-pointer" onClick={toggle4}>
                        <Form className="flex w-fit gap-2 items-center cursor-pointer" inline onSubmit={(e) => e.preventDefault()}>
                            <i className="ri-add-line text-slate-300 text-3xl hover:text-4xl cursor-pointer"></i>
                        </Form>
                    </button>

                    <Modal isOpen={modal2} toggle={toggle4}>
                        <ModalHeader className="text-zinc-600 font-bold" toggle={toggle4}>File Name</ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                placeholder="Add File Name"
                                id="suffix"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" value="SAVE" className="bg-slate-700" onClick={save}>
                                Save
                            </Button>{' '}
                        </ModalFooter>
                    </Modal>


                </div>

                <button className="h-fit w-full flex items-center py-2 px-3 cursor-pointer hover:bg-slate-600" onClick={toggle4}>
                    <Form className="flex w-full gap-2 justify-between items-center cursor-pointer" inline onSubmit={(e) => e.preventDefault()}>
                        <div className="flex items-center justify-between gap-2">
                            <i className="ri-openai-line text-slate-300 text-2xl"></i>
                            <p className="text-slate-300 text-xl font-semibold ">Conversational AI</p>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-xl-heavy text-slate-300 cursor-pointer hover:h-8 hover:w-8"><path d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z" fill="currentColor"></path></svg>
                    </Form>
                </button>
                <Modal isOpen={modal} toggle={toggle4}>
                    <ModalHeader className="text-zinc-600 font-bold" toggle={toggle4}>File Name</ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            placeholder="Add File Name"
                            id="suffix"
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" value="SAVE"  className="bg-slate-700" onClick={save}>
                            Save
                        </Button>{' '}
                    </ModalFooter>
                </Modal>

                <div className="history mt-5" id="stored">
                    {storedLinks}

                    {/* <div className="h-fit flex items-center justify-between  py-2 px-3 mt-3 cursor-pointer hover:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-slate-300 text-xl font-semibold">React Detail</p>
                        </div>


                        <Dropdown className="" isOpen={dropdown2Open} toggle={toggle2} direction="down">
                            <DropdownToggle
                                className="p-0 h-fit w-fit text-slate-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }}>
                                <i className="ri-quill-pen-line text-slate-300 text-xl hover:text-3xl"></i>
                            </DropdownToggle>
                            <DropdownMenu className="bg-zinc-800 mt-2">
                                <DropdownItem className="text-center">
                                    <button
                                        className="text-zinc-200 bg-transparent border-none w-full text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                                        onClick={restore}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        type="button"
                                        value = "RESTORE"
                                    >
                                        Restore
                                    </button>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="h-fit flex items-center justify-between  py-2 px-3 mt-3  cursor-pointer hover:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-slate-300 text-xl font-semibold">React history</p>
                        </div>
                        <Dropdown className="" isOpen={dropdown2Open} toggle={toggle2} direction="down">
                            <DropdownToggle
                                className="p-0 h-fit w-fit text-slate-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }}>
                                <i className="ri-quill-pen-line text-slate-300 text-xl hover:text-3xl"></i>
                            </DropdownToggle>
                            <DropdownMenu className="bg-zinc-800 mt-2">
                                <DropdownItem className="text-center">
                                    <button
                                        className="text-zinc-200 bg-transparent border-none w-full text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                                        onClick={restore}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        type="button"
                                        value="RESTORE"
                                    >
                                        Restore
                                    </button>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="h-fit flex items-center justify-between  py-2 px-3 mt-3 cursor-pointer hover:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-slate-300 text-xl font-semibold">React tutorials</p>
                        </div>
                        <Dropdown className="" isOpen={dropdown2Open} toggle={toggle2} direction="down">
                            <DropdownToggle
                                className="p-0 h-fit w-fit text-slate-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }}>
                                <i className="ri-quill-pen-line text-slate-300 text-xl hover:text-3xl"></i>
                            </DropdownToggle>
                            <DropdownMenu className="bg-zinc-800 mt-2">
                                <DropdownItem className="text-center">
                                    <button
                                        className="text-zinc-200 bg-transparent border-none w-full text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                                        onClick={restore}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        type="button"
                                        value="RESTORE"
                                    >
                                        Restore
                                    </button>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}
                </div>
            </div>
            <div className="w-4/5 bg-zinc-700 h-screen">
                <div className="h-fit flex justify-between items-center px-5 py-4">
                    <button className="flex w-fit gap-2 items-center cursor-pointer" onClick={toggle3}>
                        <Form className="flex w-fit gap-2 items-center cursor-pointer" inline onSubmit={(e) => e.preventDefault()}>
                            <p className="text-slate-300 text-3xl font-bold	">Conversational AI</p>
                            <i className="ri-arrow-down-s-line text-2xl text-slate-300"></i>
                        </Form>
                    </button>
                    <Modal isOpen={modal} toggle={toggle3}>
                        <ModalHeader className="text-zinc-600 font-bold" toggle={toggle3}>System</ModalHeader>
                        <ModalBody>
                            <Input
                                type="textarea"
                                placeholder="Add Summary here.."
                                rows={5}
                                name="sumary"
                                id="system"
                                value={system}
                                onChange={(e) => setSystem(e.target.value)} // Update state on input change
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" value="Subit System" className="bg-slate-700" onClick={submitSystem}>
                                Submit System
                            </Button>{' '}
                        </ModalFooter>
                    </Modal>

                    <p id="save_status" className="text-zinc-200 font-bold text-xl">
                      {saveStatus}
                    </p>

                    <div className="flex items-center gap-10">
                        <button type="Button" value="Refresh" onClick={refresh}><i className="ri-refresh-line text-2xl cursor-pointer hover:text-xl text-slate-300"></i></button>

                        <Dropdown className="" isOpen={dropdownOpen} toggle={toggle} direction="down">
                            <DropdownToggle
                                className="p-0 h-fit w-fit text-slate-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }}>
                                <i className="ri-more-2-fill text-2xl cursor-pointer hover:text-xl"></i>
                            </DropdownToggle>
                            <DropdownMenu className="bg-zinc-800 mt-2">
                                <DropdownItem className="text-center">
                                    <button
                                        className="text-zinc-200 bg-transparent border-none w-full text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                                        onClick={() => save()}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        value="SAVE-SYSTEM"
                                        type="button"
                                    >
                                        Save
                                    </button>
                                </DropdownItem>
                                <DropdownItem className="text-center">
                                    <button
                                        className="text-zinc-200 bg-transparent border-none w-full text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
                                        onClick={resetAll}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        type="button"
                                        value="CLEAR"
                                    >
                                        Clear
                                    </button>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <div className="h-3/4 chat  overflow-y-scroll no-scrollbar mb-8" id="table">
                  <table className="table-auto w-full flex flex-col gap-8 px-[60px] ">
                      {tableData}
                </table>
                      <div className="hidden" dangerouslySetInnerHTML={{ __html: completion }} />
                </div>
                        
                <div className="flex items-center justify-center gap-2 ">
                    <Input
                        className="mb-3 w-1/12 bg-zinc-600 text-zinc-200"
                        type="select"
                        name="user_type"
                        id="user_type"
                    >
                        <option value="user">
                            User
                        </option>
                        <option value="system">
                            System
                        </option>
                    </Input>
                    <Input
                        className="mb-3 p-2 w-9/12 rounded-xl bg-zinc-600 text-yellow-50 focus:bg-zinc-200 focus:text-black  placeholder:text-zinc-200"
                        type="text"
                        placeholder='Ask Conversation AI'
                        id="prompt"
                        name="prompt"
                    >
                    </Input>
                    <Input
                        className="mb-3 w-fit bg-zinc-600 text-zinc-300"
                        type="button"
                        value="Submit"
                        id="submit_prompt"
                        onClick={submitPrompt}
                    >
                        
                    </Input>
                </div>
            </div>
        </div>
    )
}

export default Home;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios for API calls
// import {
//     Dropdown,
//     DropdownToggle,
//     DropdownMenu,
//     DropdownItem,
//     Input,
//     Button,
//     Modal,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     Form,
// } from 'reactstrap';

// function Home() {
//     // Define state variables for data, modals, and dropdowns
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const [dropdown2Open, setDropdown2Open] = useState(false);
//     const [modal, setModal] = useState(false);
//     const [modal2, setModal2] = useState(false);
//     const [conversationalData, setConversationalData] = useState(null); // To store conversational AI data
//     const [systemData, setSystemData] = useState(""); // To store system data from API

//     // Toggle functions for dropdowns and modals
//     const toggle = () => setDropdownOpen(!dropdownOpen);
//     const toggle2 = () => setDropdown2Open(!dropdown2Open);
//     const toggle3 = () => setModal(!modal);
//     const toggle4 = () => setModal2(!modal2);

//     // Fetch system data when the component mounts
//     useEffect(() => {
//         fetchSystemData(); // Call API when component mounts
//     }, []);

//     // Fetch system data (Example API call from frontend.js/controller.js)
//     const fetchSystemData = () => {
//         axios.get('/api/getSystem')
//             .then((response) => {
//                 setSystemData(response.data); // Store the fetched data in state
//             })
//             .catch((error) => {
//                 console.error("There was an error fetching the system data:", error);
//             });
//     };

//     // Function to handle submitting conversational AI data (You can modify the API endpoint)
//     const submitPrompt = () => {
//         const prompt = document.getElementById("#prompt").value;
//         axios.post('/api/submitPrompt', { prompt })
//             .then((response) => {
//                 setConversationalData(response.data); // Update state with response
//             })
//             .catch((error) => {
//                 console.error("Error submitting prompt:", error);
//             });
//     };

//     // Example function for saving system data
//     const saveSystem = () => {
//         axios.post('/api/saveSystem', { data: systemData })
//             .then(() => {
//                 console.log("System data saved");
//             })
//             .catch((error) => {
//                 console.error("Error saving system data:", error);
//             });
//     };

//     return (
//         <div className=" h-screen w-full flex items-center justify-center">
//             <div className="w-1/5 bg-zinc-900 h-screen">
//                 {/* Other UI code */}
//                 <button className="h-fit w-full flex items-center py-2 px-3 cursor-pointer hover:bg-slate-600" onClick={toggle4}>
//                     <Form className="flex w-full gap-2 justify-between items-center cursor-pointer" inline onSubmit={(e) => e.preventDefault()}>
//                         <div className="flex items-center justify-between gap-2">
//                             <i className="ri-openai-line text-slate-300 text-2xl"></i>
//                             <p className="text-slate-300 text-xl font-semibold ">Conversational AI</p>
//                         </div>
//                     </Form>
//                 </button>

//                 {/* Modal for File Name */}
//                 <Modal isOpen={modal2} toggle={toggle4}>
//                     <ModalHeader className="text-zinc-600 font-bold" toggle={toggle4}>File Name</ModalHeader>
//                     <ModalBody>
//                         <Input type="text" placeholder="Add File Name" id="suffix" />
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button type="button" value="SAVE" className="bg-slate-700" onClick={saveSystem}>
//                             Save
//                         </Button>
//                     </ModalFooter>
//                 </Modal>

//                 {/* Displaying API fetched data */}
//                 <div className="history mt-5" id="stored">
//                     <p className="text-slate-200 text-xl mb-4 px-3 font-normal">Today</p>
//                     {/* Render systemData from API */}
//                     {systemData ? (
//                         <div className="h-fit flex items-center justify-between py-2 px-3 mt-3 cursor-pointer hover:bg-slate-600 rounded-lg">
//                             <p className="text-slate-300 text-xl font-semibold">{systemData}</p>
//                         </div>
//                     ) : (
//                         <p className="text-slate-300 text-lg">No data available</p>
//                     )}
//                 </div>
//             </div>

//             <div className="w-4/5 bg-zinc-700 h-screen">
//                 <div className="h-fit flex justify-between items-center px-5 py-4">
//                     <button className="flex w-fit gap-2 items-center cursor-pointer" onClick={toggle3}>
//                         <Form className="flex w-fit gap-2 items-center cursor-pointer" inline onSubmit={(e) => e.preventDefault()}>
//                             <p className="text-slate-300 text-3xl font-bold">Conversational AI</p>
//                             <i className="ri-arrow-down-s-line text-2xl text-slate-300"></i>
//                         </Form>
//                     </button>

//                     <Modal isOpen={modal} toggle={toggle3}>
//                         <ModalHeader className="text-zinc-600 font-bold" toggle={toggle3}>System</ModalHeader>
//                         <ModalBody>
//                             <Input
//                                 type="textarea"
//                                 placeholder="Add Summary here.."
//                                 rows={5}
//                                 id="system"
//                                 value={systemData}
//                                 onChange={(e) => setSystemData(e.target.value)} // Update systemData on change
//                             />
//                         </ModalBody>
//                         <ModalFooter>
//                             <Button type="button" value="Subit System" className="bg-slate-700" onClick={saveSystem}>
//                                 Submit System
//                             </Button>
//                         </ModalFooter>
//                     </Modal>

//                     <p id="save_status" className="text-zinc-200 font-bold text-xl"></p>

//                     <div className="flex items-center gap-10">
//                         <button type="Button" value="Refresh" onClick={fetchSystemData}>
//                             <i className="ri-refresh-line text-2xl cursor-pointer hover:text-xl text-slate-300"></i>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-center gap-2">
//                     <Input className="mb-3 w-1/12 bg-zinc-600 text-zinc-200" type="select" name="user_type" id="user_type">
//                         <option value="user">User</option>
//                         <option value="system">System</option>
//                     </Input>
//                     <Input
//                         className="mb-3 w-9/12 rounded-xl bg-zinc-600 text-yellow-50 focus:bg-zinc-200 focus:text-black placeholder:text-zinc-200"
//                         type="text"
//                         placeholder="Ask Conversational AI"
//                         id="prompt"
//                         name="prompt"
//                     />
//                     <Input className="mb-3 w-fit bg-zinc-600 text-zinc-300" type="button" value="Submit" id="submit_prompt" onClick={submitPrompt} />
//                 </div>
                
//                 {/* Display conversational AI data */}
//                 <div className="chat">
//                     {conversationalData && <p>{conversationalData}</p>}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Home;



