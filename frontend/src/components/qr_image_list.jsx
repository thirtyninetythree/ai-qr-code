import React, { useState } from 'react';

function QRImageList({ prompts }) {
    // function copyToClipboard (text) {
    //     navigator.clipboard.writeText(text);
    //     {navigator.clipboard.writeText(this.state.textToCopy)}}
    //     alert('Prompt copied to clipboard!');
    // };

    return (
        <div className="image-list">
            {prompts.map((prompt) => (
                <div className="image-item" key={prompts.name}>
                    <img src={prompt.public_url} alt={prompt.prompt} width="300" height="300" />
                    <h3>{prompt.prompt}</h3>
                    <button onClick={() => navigator.clipboard.writeText(prompt.prompt)}>
                        Copy
                    </button>
                </div>
            ))}
        </div>
    );
};

export default QRImageList;
