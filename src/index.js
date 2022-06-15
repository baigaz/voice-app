import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import "./style.scss"

let root = ReactDOM.createRoot(document.getElementById("root"))

const useSpeechSynthesis = () => {
    const [voices, setVoices] = useState([]);
    const synth = useRef();

    const updateVoices = () => {
        setVoices(synth.current.getVoices())
    }   

    const speak = (text, voice, pitch = 1, rate = 1) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        synth.current.speak(utterance);

    };
    
    useEffect(() => {
        
        if(typeof window !== "object" || !window.synthSynthesis){
            return;
        }

        synth.current = window.synthSynthesis;
        synth.current.onvoicechanged = updateVoices;
        updateVoices();

        return () => {
            synth.current.onvoicechanged = null;
        };
    }, []);

    return [voices, speak]
};


const Brother = (props) => {

    const [voices, speak] = useSpeechSynthesis()
    const [currentVoice, setCurrentVoice] = useState()
    const [text, setText] = useState("hello world");

    useEffect(() => {
        if(!currentVoice){
            setCurrentVoice(voices.filter((v) => v.default)[0] || voices[0]);
        }
    }, [voices]);

    const handleVoiceChange = (e) => {
        setCurrentVoice(voices.filter((v) => v.name === e.target.value)[0]);
    }

    const handleTextChange = (e) => {
        setText(e.target.value);    
    };

    const handleSpeak = (e) => {
        e.preventDefault();
        speak(text, currentVoice);
    };

    return (
        <form className="contain" onSumbit={handleSpeak}>
            <div className="select">
                <select value={currentVoice ? currentVoice.name : ""} onChange={handleVoiceChange}>
                    {
                        voices.map((v) => ( 
                            <option value={v.name} key={text}>
                                {`${v.name}`}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={text} onChange={handleTextChange} />

            <button type="submit">Speak</button>
        </form>
    )
};

root.render(<Brother />)







