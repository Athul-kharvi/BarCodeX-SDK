import React, { useState, useRef } from 'react';
import bwipjs from 'bwip-js';
import './GenerateBarcode.css';

const GenerateBarcode = () => {
    const [barcodeValue, setBarcodeValue] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [format, setFormat] = useState('Normal');
    const canvasRef = useRef();
    const previewRef = useRef();

    const generateBarcode = () => {
        console.log("hello  world");
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            console.log(ctx)
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

            // Generate barcode using bwip-js
            bwipjs.toCanvas(canvas, {
                bcid: 'code128',
                text: barcodeValue,
                scale: 5,
                height: 10,
                includetext: true,
                textxalign: 'center',
            }, (err) => {
                if (err) {
                    console.error('Error generating barcode:', err);
                } else {
                    updatePreview();
                }
            });
        } catch (error) {
            console.error('Error generating barcode:', error);
        }
        updatePreview();
    };

    const updatePreview = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const preview = previewRef.current;

        preview.innerHTML = `
            <div style="display: flex; ${
                format === 'Rattail' ? 'flex-direction: row;' : 'flex-direction: column;'
            } align-items: flex-start; padding: 10px; background-color: #eee; border-radius: 8px;">
                <div style="${
                    format === 'Rattail' ? 'margin-right: 10px;' : 'margin-bottom: 20px;'
                } width: ${format === 'Rattail' ? '200px' : '0px'};">
                    <h2 style="font-size: 30px; font-weight: bold; margin: 0; color: #555">${productName || ''}</h2>
                    <h3 style="font-size: 25px; color: #555; margin-top: ${
                        format === 'Rattail' ? '35px' : '10px'
                    };">Rs ${productPrice || ''}</h3>
                </div>
                <img src="${dataUrl}" alt="Barcode" style="width: 200px; height: 100px; ${
                    format === 'Rattail' ? 'margin-left: 40px;' : 'margin-top: 10px;'
                }" />
            </div>
        `;
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Barcode - ${format}</title>
                <style>
                *{
                    margin-left: 0px;
                    color: black;
                }
                    body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 100vh;
                        background-color: #f9f9f9;
                    }
                    .barcode-container {
                        display: flex;
                        color: black;
                        ${format === 'Rattail' ? 'flex-direction: row;' : 'flex-direction: column;'}
                        align-items: flex-start;
                        padding: 10px;
                        width: ${format === 'Rattail' ? '30rem' : '20rem'};
                        background-color: #eee;
                        border-radius: 8px;
                        margin-left: ${format === 'Rattail' ? '0px' : '0px'};
                    }
                    .product-details {
                        ${format === 'Rattail' ? 'margin-right: 10px;' : 'margin-bottom: 20px;'}
                        width: ${format === 'Rattail' ? '200px' : '0px'};
                        color: black;
                        font-size: 25px;
                        text-align: left;
                    }
                    .product-name {
                        color: #353935;	
                        font-size: 30px;
                        font-weight: bold;
                        margin: 0;
                    }
                    .product-price {
                        font-size: 30px;
                        color: #0000;	
                        width: ${format === 'Rattail' ? '300px' : '0px'};
                        margin: 10px 0 0;
                        margin-top: ${format === 'Rattail' ? '35px' : '10px'};
                    }
                    .barcode-image {
                        width: 200px;
                        height: 100px;
                        ${format === 'Rattail' ? 'margin-left: 40px;' : 'margin-top: 10px;'}
                        margin-left: ${format === 'Rattail' ? '200px' : '0rem'};
                    }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                <div class="barcode-container">
                    <div class="product-details">
                        <h2 class="product-name">${productName}</h2>
                        <h3 class="product-price">Rs ${productPrice}</h3>
                    </div>
                    <img src="${dataUrl}" alt="Barcode" class="barcode-image" />
                </div>
            </body>
        </html>
        `);
        printWindow.document.close();
        // printWindow.print();
    };

    return (
        <div className="barcode-container">
            <h1>Barcode Generator</h1>
            <form className="barcode-form">
                <div className="form-group">
                    <label>
                        Barcode Value:
                        <input
                            type="text"
                            value={barcodeValue}
                            onChange={(e) => setBarcodeValue(e.target.value)}
                            required
                            placeholder="Enter barcode value"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            placeholder="Enter product name"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Price:
                        <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                            placeholder="Enter product price"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Format:
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="cool-dropdown"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Rattail">Rattail</option>
                        </select>
                    </label>
                </div>
            </form>

            <canvas ref={canvasRef} width={300} height={150} style={{ display: 'none' }} />

            <div
                ref={previewRef}
                style={{
                    marginTop: '20px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                }}
            >
                {/* Live preview will be dynamically injected here */}
            </div>

            <div className="button-group" style={{ marginTop: '20px' }}>
                <button onClick={generateBarcode} className="generate-button">
                    Generate Preview
                </button>
                <button onClick={handlePrint} className="print-button" style={{ marginLeft: '10px' }}>
                    Print Barcode
                </button>
            </div>
        </div>
    );
};

export default GenerateBarcode;