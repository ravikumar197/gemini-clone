import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();


const ContextProvider = (props)=>{


    const delayPara = (index,nextWord)=>{
            setTimeout(function (){
                setResultData(prev=>prev+nextWord)
            },75*index)
    }
    const newChat = ()=>{
        setLoading(false)
        setShowresult(false);

    }

    const [input,setInput] = useState("")
    const [recentPrompt,setRecentPrompt] = useState("")
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowresult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");


    const onSent = async (prompt)=>{
        setResultData("")
        setLoading(true);
        setShowresult(true);
        let response;
        if(prompt !== undefined){
                response = await runChat(prompt);
                setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        // setRecentPrompt(input); 
        // setPrevPrompts(prev=>[...prev,input])
        // const response  = await runChat(input)
        let responseArray = response.split("**");
        let newResponse  = "";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2 !==1){
                newResponse += responseArray[i];
            }
            else{
                newResponse+="<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        // setResultData(newResponse2);
        let newResposeArray = newResponse2.split(" ");
        for(let i=0;i<newResposeArray.length;i++){
            const nextWord = newResposeArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false);
        setInput("");

    }

    // onSent("what is react js")

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider 